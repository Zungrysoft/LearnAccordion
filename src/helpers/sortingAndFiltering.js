import genreData from '../data/genres.json';

export function removeThe(title) {
    let ret = title.toLowerCase();
    if (ret.startsWith('the ')) {
        ret = ret.substring(4);
    }
    if (ret.startsWith('la ')) {
        ret = ret.substring(3);
    }
    while (
        ret.startsWith('¡') ||
        ret.startsWith('¿') ||
        ret.startsWith('(')
    ) {
        ret = ret.substring(1);
    }
    return ret;
}

function sortLessonSubtasksCompareEntry(a, b, sortOrderEntry) {
    if (sortOrderEntry === 'genre') {
        return (genreData[a.genre]?.priority ?? Infinity) - (genreData[b.genre]?.priority ?? Infinity);
    }
    else if (sortOrderEntry === 'points') {
        return (b.points ?? 0) - (a.points ?? 0);
    }
    else if (sortOrderEntry === 'title') {
        if (removeThe(a.title) < removeThe(b.title)) {
            return -1;
        }
        if (removeThe(a.title) > removeThe(b.title)) {
            return 1;
        }
        return 0;
    }
    else if (sortOrderEntry === 'artist') {
        if (!a.artist && b.artist) {
            return 1;
        }
        if (!b.artist && a.artist) {
            return -1;
        }

        if (removeThe(a.artist) < removeThe(b.artist)) {
            return -1;
        }
        if (removeThe(a.artist) > removeThe(b.artist)) {
            return 1;
        }
        return 0;
    }
    return 0;
}

function sortLessonSubtasksCompare(a, b, sortOrder) {
    for (const sortOrderEntry of sortOrder) {
        const res = sortLessonSubtasksCompareEntry(a, b, sortOrderEntry);
        if (res) {
            return res;
        }
    }
}

function sortLessonSubtasksGenre(a, b) {
    return sortLessonSubtasksCompare(a, b, ['genre', 'artist', 'title', '-points'])
}

function sortLessonSubtasksPoints(a, b) {
    return sortLessonSubtasksCompare(a, b, ['points', 'genre', 'artist', 'title'])
}

function sortLessonSubtasksTitle(a, b) {
    return sortLessonSubtasksCompare(a, b, ['title', 'artist'])
}

function sortLessonSubtasksArtist(a, b) {
    return sortLessonSubtasksCompare(a, b, ['artist', 'title'])
}

function getSortModeFunc(sortMode) {
    if (sortMode === 'points') {
        return sortLessonSubtasksPoints;
    }
    if (sortMode === 'artist') {
        return sortLessonSubtasksArtist;
    }
    if (sortMode === 'title') {
        return sortLessonSubtasksTitle;
    }
    return sortLessonSubtasksGenre;
}

export function sortSongs(songs, sortMode) {
    if (!songs) {
        return [];
    }

    const sortedSongs = Object.keys(songs).map(k => ({...songs[k], key: k})).sort(getSortModeFunc(sortMode));
    return sortedSongs; // .map(l => l.key);
}

export function processForFilter(text) {
  return text.toLowerCase()
    .replaceAll('ä', 'a')
    .replaceAll('é', 'e')
    .replaceAll('è', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ñ', 'n')
    .replaceAll('-', '')
    .replaceAll('\'', '')
    .replaceAll('/', '')
    .replaceAll(',', '')
    .replaceAll('.', '')
    .replaceAll('&', 'and')
  ;
}
