function markGraph(key, state, lessons, points, gMap) {
  // Early out if this node has already been marked in the gMap
  if (key in gMap) {
    return;
  }
  // Early out if this node is marked as completed
  if (state[key]?.completed === true || Object.values(state[key]?.subtasks ?? {}).filter((x) => x).length >= lessons[key].subtasks_required) {
    gMap[key] = 0;
    return;
  }
  // Early out if we have no prerequisites
  if (lessons[key].prerequisites.length === 0) {
    gMap[key] = 1;
    return;
  }

  // Mark as found so we don't end up with recursion
  gMap[key] = 9999;

  let lesson = lessons[key];
  let prereqDistances = [];
  let closestParentDistance = 9999;
  for (let prerequisite of lesson.prerequisites) {
    let optionDistances = [];
    for (let option of prerequisite) {
      const { optionId, pointsRequired } = getOptionData(option);
      markGraph(optionId, state, lessons, points, gMap)
      let distance = gMap[optionId];

      // Limit preview on some lessons prevents them from always revealing
      // their children. This helps prevent the tree from cluttering too
      // much from the music theory lessons
      if (!lessons[optionId].limit_preview) {
        closestParentDistance = Math.min(closestParentDistance, distance)
      }

      // Connectors are passthrough, so don't increment distance through them
      if (!lessons[optionId].is_connector) {
        distance++;
      }

      // Check points required for this connector. If the player doesn't have
      // enough, limit distance
      if (pointsRequired > points) {
        distance = Math.max(distance, 2);
      }

      optionDistances.push(distance);
    }
    prereqDistances.push(Math.min(...optionDistances));
  }

  gMap[key] = Math.max(...prereqDistances);

  // If one of the parents is selectable (<= 1), then this should be threshold
  // at minimum. This helps prevent the user from not realizing the next
  // lesson isn't showing up because it has some other prerequisite on a
  // less-completed branch of the tree
  if (closestParentDistance <= 1 && gMap[key] > 1) {
    gMap[key] = 2;
  }

  // If this is a star gate, mark it as completed if user has enough stars and is unlocked
  if (lesson.type === 'gate') {
    if (gMap[key] <= 1 && points >= lesson.points_required) {
      gMap[key] = 0;
    }
  }

}

// Recursive DFS search that marks each lesson in gMap by its distance from the nearest completed lesson
function buildGraph(state, lessons, points) {
  let gMap = {}
  for (let key in lessons) {
    let lesson = lessons[key]
    if (!(lesson in gMap)) {
      markGraph(key, state, lessons, points, gMap)
    }
  }

  // If a lesson is at threshold (not unlocked, but previewed), make sure all
  // of its parents are at threshold as well so the user knows that there are
  // other requirements to unlock it as well
  let atThreshold = [];
  for (const key in lessons) {
    if (gMap[key] <= 2 /* && gMap[key] > 0 */) {
      atThreshold.push(key)
    }
  }
  for (const key of atThreshold) {
    let lesson = lessons[key]
    for (let prerequisite of lesson.prerequisites) {
      for (let option of prerequisite) {
        const { optionId } = getOptionData(option);
        if (gMap[optionId] > 2) {
          gMap[optionId] = 2;
        }
      }
    }
  }


  return gMap
}

// Build a map of each lesson and its completion status
export function buildLessonStates(state, lessons, points, showLockedLessons) {
  // Build a map from each lesson to its distance from the nearest completed lesson
  let gMap = buildGraph(state, lessons, points)

  let ret = {}
  for (let key in lessons) {
    if (lessons[key].is_connector) {
      ret[key] = {
        completed: gMap[key] <= 1,
        unlocked: gMap[key] <= 1,
        threshold: gMap[key] <= 2 || showLockedLessons,
        selectable: false,
      }
    }
    else {
      ret[key] = {
        completed: gMap[key] <= 0,
        unlocked: gMap[key] <= 1,
        threshold: gMap[key] <= 2 || showLockedLessons,
        selectable: gMap[key] <= 1 || showLockedLessons,
      }
    }
  }
  // for (key in )
  return ret;
}

function dfsLessonHeights(lessonData, lesson, height) {
  if (!lesson.y || lesson.y < height + (lesson.y_offset ?? 0)) {
    lesson.y = height + (lesson.y_offset ?? 0);
  }

  for (const childLessonKey of lesson.childLessons) {
    const childLesson = lessonData[childLessonKey];
    dfsLessonHeights(lessonData, childLesson, height + 1 + (lesson.y_offset ?? 0))
  }
}

export function getOptionData(option) {
  if (typeof option === 'string') {
    return {
      optionId: option,
      pointsRequired: 0,
      bendiness: 1,
    }
  }

  return {
    optionId: option.id,
    pointsRequired: option.points_required ?? 0,
    bendiness: option.bendiness ?? 1,
  }
}

export function processLessonData(lessonData) {
  let procLessonData = {};

  // Add parent lesson keys
  for (const lessonKey in lessonData) {
    const lesson = lessonData[lessonKey];

    const parentLessonKeys = new Set();
    if (lesson.prerequisites) {
      for (const prerequisite of lesson.prerequisites) {
        for (const option of prerequisite) {
          const { optionId } = getOptionData(option);
          parentLessonKeys.add(optionId);
        }
      }
    }

    procLessonData[lessonKey] = {
      ...lesson,
      parentLessons: Array.from(parentLessonKeys),
      childLessons: [],
      id: lessonKey,
    }
  }

  // Add child lesson keys
  for (const lessonKey in procLessonData) {
    const lesson = procLessonData[lessonKey];

    for (const parentLessonKey of lesson.parentLessons) {
      const parentLesson = procLessonData[parentLessonKey];

      parentLesson.childLessons.push(lessonKey)
    }
  }

  // Determine y positions for lessons
  for (const lessonKey in procLessonData) {
    const lesson = procLessonData[lessonKey];
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
      dfsLessonHeights(procLessonData, lesson, 0);
    }
  }

  return procLessonData;
}