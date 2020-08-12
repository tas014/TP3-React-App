import React from 'react';
import '../App/index.css';
import faker from 'faker'
import EmployeeCard from '../EmployeeCard'
import Form from '../Form'

class App extends React.Component {
  //constructor para luego handlear el event y set state
    constructor() {
        super();
        //faker crea data falsa / metodo Array.from
        const employees = Array.from({ length: 30 }, () => ({
            name: faker.name.findName(),
            sector: faker.name.jobArea(),
            avatar: faker.image.avatar(),
            id: faker.random.uuid(),
        }));
        //define el sector y se fija que no sea repetido para generar un Set 
        const sectors = employees.map(({ sector }) => sector);
        const sectorsUnrepeated = new Set(sectors);
        const sectorsArray = [...sectorsUnrepeated];
        //define datos del state (preguntar por que en this y no en una let)
        this.state = {
            employees: employees,
            listBackup: employees,
            empleadoDelMes: null,
            employeeName: '',
            sectors: sectorsArray,
            dropdownActive: false,
            selectedSector: '',
            employeeToEdit: {},
            employeeToEditName: '',
            modalActive: false
        }
        //aplica los metodos de handle que posee la clase App
        this.handleEmpleadoMesClick = this.handleEmpleadoMesClick.bind(this);
        this.handleAddEmployeeSubmit = this.handleAddEmployeeSubmit.bind(this);
        this.handleAddEmployeeChange = this.handleAddEmployeeChange.bind(this);
        this.handleEditEmployee = this.handleEditEmployee.bind(this);
    }

    handleEmpleadoMesClick(employeeId) {
        //setState con el id del empleado del mes
        this.setState({
            empleadoDelMes: employeeId
        });
        setTimeout(() => {
            console.log('state', this.state.empleadoDelMes)
        }, 1);
    }

    //setState con el valor de employeeName que clickea el usuario
    handleAddEmployeeChange = event => {
        const { value } = event.target;
        this.setState({ employeeName: value });
    }
    //
    handleAddEmployeeSubmit = event => {
        event.preventDefault();
        const { employees, employeeName } = this.state //Leer del estado
        //datos del nuevo empleado
        if (employeeName!='') {
        const newEmployee = {
            name: employeeName,
            sector: faker.name.jobArea(),
            avatar: faker.image.avatar(),
            id: faker.random.uuid(),
        };
        const newList = [newEmployee, ...employees]; //combina el array viejo con el valor extra del nuevo empleado
        this.setState({ 
            employees: newList,
            listBackup: newList
         }) //Setear el estado
        }
    }

    //Dropdown
    handleDropdownActive = () => {
        this.setState(prevState => ({ dropdownActive: !prevState.dropdownActive })) //alterna entre true y false para el estado del dropdown segun si esta activo o no
    }
    //aplica el metodo .filter para generar una nueva lista con los empleados que comparten sector
    handleSelectSector = sector => {
        const { listBackup } = this.state;
        const listFilteredBySector = listBackup.filter(employee => employee.sector === sector);
        this.setState({
            selectedSector: sector,
            employees: listFilteredBySector,
            dropdownActive: false,
        })
    }
    //devuelve employees a su estado previo al filtro
    handleRemoveSelectedSector = () => {
        this.setState(prevState => ({ employees: prevState.listBackup, selectedSector: '' }))
    }
    //obtiene employees del this.state, genera una nueva lista sin el empleado especificado y setea el state con la nueva lista
    handleRemoveEmployee = id => {
        const { employees } = this.state;
        const listWithoutEmployee = employees.filter(employee => employee.id !== id);
        this.setState({ employees: listWithoutEmployee, listBackup:listWithoutEmployee });
    }
    //utiliza el metodo find para actualizar la data en el array de la posicion correspondiente al id del empleado
    handleEditEmployee = id => {
        const { employees } = this.state;
        const selectedEmployee = employees.find(employee => employee.id === id);
        this.setState({
            employeeToEdit: selectedEmployee,
            modalActive: true,
            employeeToEditName: selectedEmployee.name
        })
    }
    //establece false al cerrar el modal
    handleModalClose = () => {
        this.setState({ modalActive: false })
    }
    //actualiza la lista al editar
    handleEmployeeEdit = (event) => {
        event.preventDefault();
        const { employeeToEdit, employees } = this.state;
        const listWithoutEmployee = employees.filter(employee => employee.id !== employeeToEdit.id);
        this.setState({
            employees: [employeeToEdit, ...listWithoutEmployee],
            listBackup: [employeeToEdit, ...listWithoutEmployee],
            modalActive: false
        })
    }
    //actualiza el nombre del empleado que estamos agregando o editando
    handleEditEmployeeName = (event) => {
        const { value } = event.target;
        this.setState(prevState => (
            {
                employeeToEditName: value,
                employeeToEdit: { ...prevState.employeeToEdit, name: value}
            })
        )
    }
    //metodo render
    render() {
      //destructuring de la data que contiene this.state
        const {
            employees,
            dropdownActive,
            sectors,
            selectedSector,
            modalActive,
        } = this.state
        //aplica sintaxis JSX a los componentes y sus respectivos props y funciones. 
        return (
            <div className='container'>
                <h1 className='is-size-1'>Lista de Empleados</h1>

                <Form
                    handleAddEmployeeChange={this.handleAddEmployeeChange}
                    handleAddEmployeeSubmit={this.handleAddEmployeeSubmit}
                    employeeName={this.state.employeeName}
                />

                <Dropdown
                    sectors={sectors}
                    dropdownActive={dropdownActive}
                    selectedSector={selectedSector}
                    onSelectSector={this.handleSelectSector}
                    onDropdownActive={this.handleDropdownActive}
                    onRemoveSelectedSector={this.handleRemoveSelectedSector}
                />
                
                {modalActive && (
                    <div className='modal is-active'>
                        <div className='modal-background' />
                        <div className='modal-card'>
                            <header className='modal-card-head'>
                                <p className='modal-card-title'>Modal title</p>
                                <button className='delete' aria-label='close'
                                    onClick={this.handleModalClose}
                                />
                            </header>
                            <section className='modal-card-body'>
                                <form className='form-add-employee'
                                    onSubmit={this.handleEmployeeEdit}
                                >
                                    <input
                                        className='input'
                                        type='text'
                                        value={this.state.employeeToEditName}
                                        onChange={this.handleEditEmployeeName}
                                    />
                                    <button className='button is-success' type='submit'>
                                        Actualizar
                                    </button>
                                </form>
                            </section>
                        </div>
                    </div>
                )}

                {
                    employees.map((employee) =>
                        <EmployeeCard
                            employeeData={employee}
                            key={employee.id}
                            handleEmpleadoMesClick={this.handleEmpleadoMesClick}
                            empleadoDelMesID={this.state.empleadoDelMes}
                            handleRemoveEmployee={this.handleRemoveEmployee}
                            handleEditEmployee={this.handleEditEmployee}
                        />
                    )
                }
            </div>
        )
    }
}
//Componente Dropdown
const Dropdown = props => {
    //destructuring de los props
    const {
        dropdownActive,
        sectors,
        onDropdownActive,
        onSelectSector,
        selectedSector,
        onRemoveSelectedSector,
    } = props;
    //JSX con el HTML y la condición del dropdown (true o false) dentro de la clase del div en la linea 225. Ver también el código con la funcion map entre las lineas 241 y 250.
    return (
        <div>
            <div className={`dropdown ${dropdownActive === true ? 'is-active' : ''}`}>
                <div className='dropdown-trigger'>
                    <button
                        className='button'
                        aria-haspopup='true'
                        aria-controls='dropdown-menu'
                        onClick={onDropdownActive}
                    >
                        <span>Elegir sector</span>
                        <span className='icon is-small'>
                            <i className='fas fa-angle-down' aria-hidden='true' />
                        </span>
                    </button>
                </div>
                <div className='dropdown-menu' id='dropdown-menu' role='menu'>
                    <div className='dropdown-content'>
                        {sectors.map(sector => (
                            <button
                                key={sector}
                                href='#'
                                className='dropdown-item'
                                onClick={() => onSelectSector(sector)}
                            >
                                {sector}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            {selectedSector && (
                <button
                    className='button'
                    aria-haspopup='true'
                    aria-controls='dropdown-menu'
                    onClick={onRemoveSelectedSector}
                    style={{ marginLeft: '15px' }}
                >
                    <span>{selectedSector}</span>
                    <span className='icon is-small'>
                        <i className='fas fa-trash-alt' aria-hidden='true' />
                    </span>
                </button>
            )}

        </div>
    )
}

export default App;