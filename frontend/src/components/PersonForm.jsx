import React from 'react';

const PersonForm = (props) => {
    return (

        <form onSubmit={props.handleAddPerson}>
          <div>
            name: <input value={props.newName} onChange={props.handleNameInput} />
          </div>
          <div>
            number: <input value={props.newNumber} onChange={props.handleNumberInput} />
          </div>
          <div>
            <button type='submit'>add</button>
          </div>
        </form>
    );
}

export default PersonForm;