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

    const toast = useRef(null);

    // const [getPosts, {data, loading, error}] = useLazyQuery(GET_GARANTIA_IMEI_DATA);
    //console.log(data && data.garantiaLidenar.garantia);

    const showImei = async enteredName => {

        if (enteredName.length === 15) {

            console.log("IMEI A CONSULTAR: " + enteredName);

            //PAC
            console.log("Buscando en el sistema Facturacion PAC")
            const responsePac = await fetch("http://191.100.22.203:3001/st/buscarimei/", {
                method: "POST", headers: {
                    "Content-Type": "application/json", "Accept": "application/json",
                }, body: JSON.stringify({
                    imei: `${enteredName}`
                })

            }).then(responseP => responseP)

            console.log(responsePac)

            //Creamos un JSON
            var obj = new Object();

            console.log("Status 200: " + responsePac.status)
            if (responsePac.status === 500) {
                console.log("Status 500: " + responsePac.status);
                //SAP
                console.log("Buscando en el sistema Facturacion SAP")
                // const response = await fetch(`http://192.168.0.110:8091/LIDENAR.asmx/GetImeis?Imeifiltro=` + enteredName, {
                //     method: "GET"
                // }).then(response => response.json())

                const responseSap = await fetch(`http://191.100.22.203:3001/sap/imeifiltro/`, {
                    method: "POST", headers: {
                        "Content-Type": "application/json", "Accept": "application/json",
                    }, body: JSON.stringify({
                        imei: `${enteredName}`
                    })
                }).then(responseS => responseS)

                if (responseSap.status === 200) {

                    let jsonSap = await responseSap.json();
                    console.log("json: " + jsonSap);

                    //Asignamos a una variable
                    let fecha_venta = jsonSap.fechaVenta

                    console.log(fecha_venta)
                    //Pasamos la variable para la conversion
                    let date_1 = new Date(fecha_venta);
                    console.log(date_1);
                    let date_hoy = new Date();

                    const days = (date_1, date_hoy) => {
                        let difference = date_hoy.getTime() - date_1.getTime();
                        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                        return TotalDays;
                    }
                    let numero_dias = days(date_1, date_hoy)
                    console.log(numero_dias + " días.");

                    //Fecha finalizacion de garantia.
                    var fecha = new Date(date_1);
                    console.log("uno: " + fecha);
                    fecha.setDate(fecha.getDate() + 365);
                    let fechaFinGarantia = fecha.toISOString("en-US", {timeZone: "America/Guayaquil"});

                    //Creamos un JSON
                    var obj = new Object();
                    if (numero_dias <= 365) {
                        console.log("SI TIENE GARANTIA.")

                        obj.garantia = "SI TIENE GARANTÍA. VENCE EL " + fechaFinGarantia;
                    } else {
                        console.log("NO TIENE GARANTIA.")
                        obj.garantia = "NO TIENE GARANTÍA. SU GARANTÍA VENCIÓ EL " + fechaFinGarantia;
                    }

                } else {
                    console.log("Status 204: " + responseSap.status);
                    obj.garantia = "TELEFONO NO FUE FACTURADO EN LIDENAR.";
                }

            } else {

                let jsonPac = await responsePac.json();

                //Fecha finalizacion de garantia.
                var fecha = new Date(jsonPac.producto.fecmov05);
                fecha.setDate(fecha.getDate() + 365);
                let fechaFinGarantia = fecha.toISOString("en-US", {timeZone: "America/Guayaquil"});
                console.log("Fecha fin de garantia: " + fechaFinGarantia)

                console.log(jsonPac.producto.tieneGarantia)
                let tieneGarantia = jsonPac.producto.tieneGarantia

                if (tieneGarantia == true) {
                    console.log("SI TIENE GARANTIA.")
                    obj.garantia = "SI TIENE GARANTÍA. VENCE EL " + fechaFinGarantia;
                } else {
                    console.log("NO TIENE GARANTIA.")
                    obj.garantia = "NO TIENE GARANTÍA. SU GARANTÍA VENCIÓ EL " + fechaFinGarantia;
                }

            }

            //PROCESAMOS LOS DATOS PARA LAS DOS SISTEMAS DE FACTURACION

            //convert object to json string
            var string = JSON.stringify(obj);
            console.log(string);
            var objDos = JSON.parse(string);
            console.log(objDos.garantia);

            //Retornamos el objeto
            setGarantia(objDos.garantia)

            //Departamento de servicio tecnico

            //PAC
            console.log("Buscando en el sistema Facturacion PAC")
            const validacionImei = await fetch("http://191.100.22.203:3002/grunsoft/rest/movilmv/buscar_only_imei_st", {
                method: "POST", headers: {
                    "Content-Type": "application/json", "Accept": "application/json",
                }, body: JSON.stringify({
                    mensaje: `${enteredName}`
                })

            }).then(response => response.json())

            console.log("Validacion Imei: " + validacionImei.validacion);
            setLogitech(validacionImei.validacion)

            //Creamos un JSON
            //var objValidacion = new Object();

            // var stringV = JSON.stringify(validacionImei);
            // console.log(stringV);
            // var objV2 = JSON.parse(stringV);
            // console.log(objV2.validacion);
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

                            <img src={`${contextPath}/layout/images/logytech.jpeg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2"/>
                            <br></br>
                            <span>
                                    +(593) 4 5000261</span> <br></br>
                            <span>
                                cristian.yepez@logytechmobile.com</span><br></br>
                            <span>
                                Av. de las Américas 309 y José Mejía Lequerica, Guayaquil – Ecuador
                            </span>
                        </div>) : (<div className="align-content-center">

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
                            </div>)

                        }


                    </div>

                </div>

            </div>

        </div>);
};
export default Dashboard;
