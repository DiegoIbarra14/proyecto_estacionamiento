import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import './CardsC.css';
import packageCheck from '../../../Imagenes/package-check.svg';
import packageEye from '../../../Imagenes/package-eye.svg';
import inboxIcon from '../../../Imagenes/inbox-icon.svg';
import usersProfiles from '../../../Imagenes/users-profiles.svg';
import { getAllDataCards } from '../../../Services/EstadisticasService';

export const Cards = () => {
    const [dataCardsStadistics, setDataCardsStadistics] = useState([
        { code: "cant_prod", title: "Cantidad de Producciones", value: 0, change: "2%", changeType: "positive", icon: packageCheck, variacion: '-1' },
        { code: "prod_obsr", title: "Producciones Observadas", value: 0, change: "1.4%", changeType: "positive", icon: packageEye, variacion: 'Sin registros' },
        { code: "cant_ped", title: "Cantidad de Pedidos", value: 0, change: "1%", changeType: "negative", icon: inboxIcon, variacion: '-4' },
        { code: "cant_cli", title: "Nuevos Clientes", value: 0, change: "1.4%", changeType: "positive", icon: usersProfiles, variacion: '-3' }
    ]);

    const getDataCards = async () => {
        try {
            let response = await getAllDataCards();
            let dataCards = dataCardsStadistics.map((item) => {
                return { 
                    ...item, 
                    value: response?.[item.code]?.cantidad,
                    variacion: response?.[item.code]?.variacion 
                };
            });

            setDataCardsStadistics(dataCards);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDataCards();
    }, []);

    const containsLetters = (str) => /[a-zA-Z]/.test(str);
    const containsNumbers = (str) => /\d/.test(str);

    return (
        <div className="card__estadisticas">
            {dataCardsStadistics.map((item, index) => (
                <Card key={index} className="card__estadistica">
                    <div className="card__content">
                        <div className="card__header">
                            <span className="card__title">{item.title}</span>
                        </div>
                        <div style={{ paddingLeft: '0.8rem' }}>
                            <div className="card__value">{item.value}</div>
                            <div className={"card__change " + (parseFloat(item.variacion) < 0 ? 'negative' : 'positive')}>
                                {!containsLetters(item.variacion) && containsNumbers(item.variacion) && (
                                    <span className={"pi " + (parseFloat(item.variacion) < 0 ? 'pi-arrow-down' : 'pi-arrow-up')}></span>
                                )}
                                {containsLetters(item.variacion) ? (
                                    <span style={{ fontWeight: '500' }}>{item.variacion}</span>
                                ) : (
                                    containsNumbers(item.variacion) ? (
                                        <span style={{ fontWeight: '500', color: parseFloat(item.variacion) < 0 ? 'red' : 'green' }}>
                                            {item.variacion}%
                                        </span>
                                    ) : (
                                        <span style={{ fontWeight: '500' }}>{item.variacion}</span>
                                    )
                                )}
                                {!containsLetters(item.variacion) && containsNumbers(item.variacion) && (
                                    <span style={{ color: '#4A4A4A73', paddingLeft: '0.6rem', font: 'Poppins', fontWeight: '500' }}>mes anterior</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card__icon-container">
                        <img src={item.icon} alt={item.title} className="card__icon" />
                    </div>
                </Card>
            ))}
        </div>
    );
}
