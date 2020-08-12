import React from 'react'

const Form = props => {
    //Destructuring de props
    const {
        employeeName,
        handleAddEmployeeSubmit,
        handleAddEmployeeChange
    } = props
    //JXS con el form y la funcion en el onchange en la linea 17
    return (
        <form onSubmit={handleAddEmployeeSubmit} className='form-add-employee'>
            <input
                className='input'
                type='text'
                value={employeeName}
                onChange={handleAddEmployeeChange}
            />
            <button className='button is-success' type='submit'>
                Agregar Empleado
            </button>
        </form>
    )
}

export default Form