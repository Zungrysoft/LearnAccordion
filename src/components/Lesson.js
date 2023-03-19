import '../App.css';

function Lesson({ lesson, data, onChange }) {
    return (
        <div className="bounding-box-lesson">
            <h4 className="lesson-label" >{lesson.title}</h4>
        </div>
    )
}

export default Lesson;
