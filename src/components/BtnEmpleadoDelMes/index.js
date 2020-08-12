import React from 'react'

const BtnEmpleadoDelMes = props => {
    //Destructuring de props
    const {
        employeeId,
        handleEmpleadoMesClick
    } = props
    //JXS con la funcion onclick declarada en la linea 13
    return (
        <button
            className='button is-info'
            onClick={()=>handleEmpleadoMesClick(employeeId)}
        >
            <span className='icon is-small'>
                <i className='fas fa-award' />
            </span>
            <span>Empleado del mes</span>
        </button>
    )
}

export default BtnEmpleadoDelMes