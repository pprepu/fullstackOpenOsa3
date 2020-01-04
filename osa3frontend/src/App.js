import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Message from "./components/Message";
import personService from "./services/persons";

const App = () => {

  const standardStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: "center"
  }

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: "center"
  }

  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({ content: null, style: standardStyle });

  useEffect(() => {
    personService.getAll()
      .then(allPersons => {
        setPersons(allPersons);
      })
  }, [])



  const showPersons = () => {
    let shownPersons = [];

    if (filter === "") {
      shownPersons = persons;
    } else {
      shownPersons = persons.filter(person =>
        person.name.toUpperCase().includes(filter.toUpperCase())
      );
    }

    return shownPersons.map(person => {
      return (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deleteSomeone(person.id, person.name)}> delete </button>
        </li>
      )
    }
    );
  };

  const deleteSomeone = (id, name) => {
    let confirmation = window.confirm(`Delete ${name}?`);

    if (!confirmation) {
      return;
    }

    personService.deletePerson(id)
      .then(returnedStatus => {
        const deletedPerson = persons.find(person => person.id === id);
        setPersons(persons.filter(person => person.id !== id))
          //viestiä voisi kontrolloida palautetun statuksen perusteella
        setMessage({ content: `${deletedPerson.name} has been deleted`, style: standardStyle })

        setTimeout(() => {
          setMessage({ content: null, style: standardStyle })
        }, 5000)

      })
  }

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = event => {
    setFilter(event.target.value);
  };


  const addPerson = event => {
    if (
      persons
        .map(person => person.name.toUpperCase())
        .includes(newName.toUpperCase())
    ) {
      event.preventDefault();
      let confirmation = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);

      if (!confirmation) {

        setNewName("");
        setNewNumber("");
      } else {
        const foundPerson = persons.find(person =>
          person.name.toUpperCase() === newName.toUpperCase());

        const foundId = foundPerson.id;

        const changedPerson = {
          ...foundPerson, number: newNumber
        };

        personService.update(foundId, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(
              person => person.id !== foundId ? person : returnedPerson)
            )

            setMessage({ content: `Number of ${returnedPerson.name} has been changed`, style: standardStyle })
            setNewName("");
            setNewNumber("");

            setTimeout(() => {
              setMessage({ content: null, style: standardStyle })
            }, 5000)
          }).catch(error => {
            setMessage({ content: `${changedPerson.name} was already deleted from the server`, style: errorStyle })

            setTimeout(() => {
              setMessage({ content: null, style: standardStyle })
            }, 5000)

            setPersons(persons.filter(person => person.id !== foundId));
          })
      }

    } else {
      event.preventDefault();
      const personObject = {
        name: newName,
        number: newNumber
      };

      personService.create(personObject)
        .then(person => {
          setPersons(persons.concat(person));

          setMessage({ content: `${person.name} has been added`, style: standardStyle })
          setNewName("");
          setNewNumber("");

          setTimeout(() => {
            setMessage({ content: null, style: standardStyle })
          }, 5000)
        })
        .catch(error => {
          setMessage({ content: error.response.data.error, style: errorStyle })
          setNewName("");
          setNewNumber("");

          setTimeout(() => {
            setMessage({ content: null, style: standardStyle })
          }, 5000)
        })


    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Message message={message} />

      <Filter filter={filter} onChangeFunction={handleFilterChange} />

      <h3>Add a new person</h3>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit"> add </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>{showPersons()}</ul>
    </div>
  );
};

export default App;
