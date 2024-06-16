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

const Notification = ({notification}) => {
  if (notification.message === null) {
    return null
  }

  if (notification.type === 'success')
  return (
    <div className='success'>
      {notification.message}
    </div>
  )

  if (notification.type === 'error')
    return (
      <div className='error'>
        {notification.message}
      </div>
    )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({name: '', number: ''});
  const [filterName, setFilterName] = useState('');
  const [notification, setNotification] = useState({type: null, message: null});

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
        isNameExisted = true;
        oldPerson = {...person};
      };
    })
    if (!isNameExisted) {
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`, 'success');
      })
    } else {
      if(window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
        .update(oldPerson.id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          showNotification(`Changed number for ${returnedPerson.name}`, 'success');
        })
        .catch(error => {
          showNotification(`Information of ${oldPerson.name} has already been removed from server`, 'error');
          setPersons(persons.filter(p => p.id !== oldPerson.id))
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
        showNotification(`Deleted ${name}`, 'success');
      })
      .catch(error => {
        showNotification(`Information of ${name} has already been removed from server`, 'error');
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const showNotification = (message, type) => {
    setNotification(
      {
        type: type,
        message: message
      }
    )
    setTimeout(() => {
      setNotification({type: null, message: null});
    }, 5000)
  }

  const personsToShow = filterName.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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