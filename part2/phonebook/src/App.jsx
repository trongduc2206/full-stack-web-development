import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({value, onChange}) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({onSubmit, person, onChange}) => {
  return (
    <form onSubmit={onSubmit}>
        <div>
          name:
          <input
            name='name'
            value={person.name}
            onChange={onChange}
          />
        </div>
        <div>
          number:
          <input
            name='number'
            value={person.number}
            onChange={onChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Person = ({person, onDelete}) => {
  return (
    <div>
      {person.name} {person.number}
      <button style={{marginLeft: "5px"}} onClick={() => onDelete(person.id, person.name)}>delete</button>
    </div>
  )
}

const Persons = ({persons, onDelete}) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.id}  person={person} onDelete={onDelete}/>
      )}
    </div>
  );
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({name: '', number: ''});
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const onChange = (event) => {
    setNewPerson({...newPerson, [event.target.name]: event.target.value});
  }

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();
    let isNameExisted = false;
    let oldPerson = null;
    persons.forEach((person) => {
      if (person.name === newPerson.name) {
        // alert(`${newPerson.name} is already added to phonebook`)
        isNameExisted = true;
        oldPerson = {...person};
      };
    })
    if (!isNameExisted) {
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
    } else {
      if(window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(oldPerson.id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
        })
      }

    }
    setNewPerson({name:'', number:''});
  }

  const onDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
      .remove(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== returnedPerson.id));
      })
    }
  }

  const personsToShow = filterName.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterName} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addPerson}  
        person={newPerson}
        onChange={onChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={onDeletePerson}/>
    </div>
  )
}

export default App