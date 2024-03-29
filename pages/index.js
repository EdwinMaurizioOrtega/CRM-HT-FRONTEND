import {Button} from 'primereact/button';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
import {InputText} from "primereact/inputtext";
import {Toast} from 'primereact/toast';

import getConfig from 'next/config';

const Dashboard = () => {

    const [enteredName, setEnteredName] = useState(''); //INIT TO EMPTY
    const [garantia, setGarantia] = useState('');
    const [logitech, setLogitech] = useState('')

    const [marca, setMarca] = useState('');

    const toast = useRef(null);

    // const [getPosts, {data, loading, error}] = useLazyQuery(GET_GARANTIA_IMEI_DATA);
    //console.log(data && data.garantiaLidenar.garantia);

    const showImei = async enteredName => {

        if (enteredName.length === 15) {

            console.log("IMEI A CONSULTAR: " + enteredName);

            //PAC
            console.log("Buscando en el sistema Facturacion PAC")
            const responseFull = await fetch("https://crm.hipertronics.us/api/crm-ht/garantia_imei_pac_sap?id=" + enteredName, {
                method: "GET"

            }).then(responseP => responseP)

            console.log(responseFull)

            console.log("Status 200: " + responseFull.status)
            let jsonFull = await responseFull.json();


            //Retornamos el objeto
            setGarantia(jsonFull.message);
            setMarca(jsonFull.marca);


            //Departamento IMEIs de Logitech
            console.log("Buscando en el cloud CRM HT.")
            const validacionImei = await fetch("https://crm.hipertronics.us/api/crm-ht/logitech?description=" + enteredName, {
                method: "GET"

            }).then(response => response)

            console.log("Status 200: " + validacionImei.status)

            let jsonVal = await validacionImei.json();
            setLogitech(jsonVal.validacion)


        } else {
            toast.current.show({severity: 'error', summary: 'Mensaje de error', detail: 'El IMEI debe tener 15 dígitos.', life: 3000});

        }

    }

    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    //const mostrarCondicion = {}


    return (

        <div className="grid">
            <Toast ref={toast}/>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">

                    <h1 className="mb-2 ls-m">Validar Garantía Lidenar - Hipertronics</h1>
                    <div className="App" style={{display: "contents"}}>

                        <div className="input-wrapper input-wrapper-inline input-wrapper-round">
                            <InputText type="text" className="form-control email" name="email" id="email2" placeholder="IMEI here..." required

                                       onChange={e => {
                                           setEnteredName(e.currentTarget.value);
                                       }}
                            />
                            <Button className="btn btn-dark"

                                    onClick={() => {
                                        showImei(enteredName)
                                    }}
                            >BUSCAR</Button>
                        </div>
                        <h5>{garantia}</h5>

                        {logitech == true ? (<div className="align-content-center">

                            {/*<img src={`${contextPath}/layout/images/logytech.jpeg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2"/>*/}
                            {/*<br></br>*/}
                            {/*<span>*/}
                            {/*        +(593) 4 5000261</span> <br></br>*/}
                            {/*<span>*/}
                            {/*    cristian.yepez@logytechmobile.com</span><br></br>*/}
                            {/*<span>*/}
                            {/*    Av. de las Américas 309 y José Mejía Lequerica, Guayaquil – Ecuador*/}
                            {/*</span>*/}

                            <img src={`${contextPath}/layout/images/bit.jpeg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2"/>
                            <br></br>
                            <span>
                                    Teléfonos de contacto: +593 99 110 5322  / +593 98 119 3615</span> <br></br>
                            <span>
                                Cuenca
                                Luis Cordero 10-32 y Gran Colombia,
                                Guayaquil.
                                Francisco de Orellana y A. Bordes Najera.
                            </span>

                        </div>) : (

                            marca == 'SAMSUNG' ? (<div className="align-content-center">

                                <img src={`${contextPath}/layout/images/bit.jpeg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2"/>
                                <br></br>
                                <span>
                                    Teléfonos de contacto: +593 99 110 5322  / +593 98 119 3615</span> <br></br>
                                <span>
                                Cuenca
                                Luis Cordero 10-32 y Gran Colombia,
                                Guayaquil.
                                Francisco de Orellana y A. Bordes Najera.
                            </span>

                            </div>) : (


                                marca == 'NOKIA' ? (
                                    <div className="align-content-center">
                                        <img src={`${contextPath}/layout/images/logytech.jpeg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2"/>
                                        <br></br>
                                        <span>
                                +(593) 4 5000261</span> <br></br>
                                        <span>
                            cristian.yepez@logytechmobile.com</span><br></br>
                                        <span>
                            Av. de las Américas 309 y José Mejía Lequerica, Guayaquil – Ecuador
                                        </span>
                                    </div>

                                ) : (


                                    <div className="align-content-center">

                                        {/*    <img src={`${contextPath}/layout/images/lidenar.jpeg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2"/>*/}
                                        {/*    <br></br>*/}
                                        {/*    <span>*/}
                                        {/*    Alejandra Logroño*/}
                                        {/*</span>*/}
                                        {/*    <br></br>*/}
                                        {/*    <span>*/}
                                        {/*    Contacto: 0992232222*/}
                                        {/*    Dirección: Cuenca - Padre Aguirre 9-68 y Gran colombia.*/}
                                        {/*    Email: asistente@hipertronics.us*/}
                                        {/*</span>*/}

                                        <img src={`${contextPath}/layout/images/bit.jpeg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2"/>
                                        <br></br>
                                        <span>
                                    Teléfonos de contacto: +593 99 110 5322  / +593 98 119 3615</span> <br></br>
                                        <span>
                                Cuenca
                                Luis Cordero 10-32 y Gran Colombia,
                                Guayaquil.
                                Francisco de Orellana y A. Bordes Najera.
                            </span>

                                    </div>


                                )


                            )


                        )
                        }

                    </div>

                </div>

            </div>

        </div>);
};
export default Dashboard;
