const Header = (props) => {
    return (
      <div>
        <h2>{props.course}</h2>
      </div>
    )
  }
  
const Part = ({ part }) => {
    return (
        <p>
        {part.name} {part.exercises}
        </p>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
        {parts.map(part => 
            <Part key={part.id} part={part} />
        )}
        </div>
    )
}
const Total = ({ parts }) => {
    const total = parts.reduce(
        (accumulator, part) => accumulator + part.exercises,
        0,
    );
    return (
        <h3>total of {total} exercises </h3>
    )
}

const Course = ({ course }) => {
    return (
        <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
        </div>

    )
}

export default Course