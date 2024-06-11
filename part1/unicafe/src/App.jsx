import { useState } from 'react'
import './App.css'

const Header = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <div>
      <button onClick={onClick}>
        {text}
      </button>
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all > 0) {
    const positiveDisplay = `${positive} %`
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={all} />
            <StatisticLine text='average' value={average} />
            <StatisticLine text='positive' value={positiveDisplay} />
          </tbody>
        </table>
      </div>
    )
  };
  return (
    <p>No feedback given</p>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0);
  const [positive, setPostive] = useState(0);

  const calculateAverageScore = (good, bad, all) => {
    return (good - bad) / all;
  }

  const calculatePositivePercentage = (good, all) => {
    return (good / all) * 100;
  }

  const onClickGood = () => {
    const updatedGood = good + 1;
    const updatedAll = updatedGood + neutral + bad;
    setGood(updatedGood);
    setAll(updatedAll);
    setAverage(calculateAverageScore(updatedGood, bad, updatedAll));
    setPostive(calculatePositivePercentage(updatedGood, updatedAll));
  }

  const onClickNeutral = () => {
    const updatedNeutral = neutral + 1;
    const updatedAll = good + updatedNeutral + bad;
    setNeutral(updatedNeutral);
    setAll(updatedAll);
    setAverage(calculateAverageScore(good, bad, updatedAll));
    setPostive(calculatePositivePercentage(good, updatedAll));
  }

  const onClickBad = () => {
    const updatedBad = bad + 1;
    const updatedAll = good + neutral + updatedBad
    setBad(updatedBad);
    setAll(updatedAll);
    setAverage(calculateAverageScore(good, updatedBad, updatedAll));
    setPostive(calculatePositivePercentage(good, updatedAll));
  }

  return (
    <div>
      <Header title='give feedback' />
      <div className='button-container'>
        <Button onClick={onClickGood} text='good' />
        <Button onClick={onClickNeutral} text='neutral' />
        <Button onClick={onClickBad} text='bad' />
      </div>
      <Header title='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />


    </div>
  )
}

export default App