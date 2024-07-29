import { useState, useEffect } from 'react';
import personService from './services/persons';
//import personService from './api/persons'
import './App.css'; 


const Filter = ({ searchTerm, handleSearchChange }) => {
  console.log("app Filter");
  return (
    <div>
      filter shown with <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  console.log("app Personform");
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, searchTerm, handleDelete }) => {
  console.log("App Persons");
  return (
    <ul>
      {persons
        .filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(person =>
          <Person key={person.id} person={person} handleDelete={handleDelete} />
        )}
    </ul>
  );
};

const Person = ({ person, handleDelete }) => {
  console.log("App person");
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </li>
  );
};

const Notification = ({ message, error }) => {
  console.log("app notification");
  if (message === null) {
    return null;
  }

  return (
    <div className={error ? 'error' : 'notification'}>
      {message}
    </div>
  );
};

const App = () => {
  console.log("App App");
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("App use effect");
    console.log(personService)
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleNameChange = (event) => {
    console.log("app handleNameChange");
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log("app handleNumber");
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    console.log("aoo hanldeSearchChange");
    setSearchTerm(event.target.value);
  };

  const addPerson = (event) => {
    console.log("add Peson");
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName('');
            setNewNumber('');
            setNotification(`Updated ${returnedPerson.name}'s number`);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch(error => {
            console.error('Error updating person:', error);
            setError(true);
            setNotification(`Information of ${existingPerson.name} has already been removed from server`);
            setTimeout(() => {
              setNotification(null);
              setError(false);
            }, 5000);
          });
      }
    } else {
      console.log("app else add person");
      const personObject = {
        name: newName,
        number: newNumber
      };

      personService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          setChangeMessage(`[error] ${error.response.data.error}`);
        });
      }         
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification(`Deleted ${personToDelete.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} error={error} />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson} 
      />

      <h3>Numbers</h3>

      <Persons persons={persons} searchTerm={searchTerm} handleDelete={handleDelete} />
    </div>
  );
};

export default App;