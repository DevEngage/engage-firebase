import React, {useState} from "react";
import {IonIcon, IonItem, IonLabel, IonActionSheet} from "@ionic/react";
import {more} from "ionicons/icons";
import "./sectionItem.scss";

const SectionItem = ({id, setActiveId, label, optionsData, icon = null, src = null, stats = null}) => {

    const [showActionSheet, setShowActionSheet] = useState(false);

    return (
        <>
            <IonItem lines="none" className="section-item">
                {icon && <IonIcon className="start-icon" icon={icon}></IonIcon>}
                {src && <IonIcon className="start-icon" src={src}></IonIcon>}
                <IonLabel className="ion-padding-start">
                    {label}
                </IonLabel>
                {stats && stats.length > 0 && stats.map((stat) => (
                    <div className="stats-area" key={stat.name}>
                        <p>{stat.amount}</p>
                        <p className="small-text">{stat.name}</p>
                    </div>
                ))}
                <IonIcon className="end-icon" slot="end" icon={more} onClick={() => {setShowActionSheet(true); setActiveId(id)}}></IonIcon>
            </IonItem>
            <IonActionSheet isOpen={showActionSheet} onDidDismiss={(data) => {if (data.detail.role) setShowActionSheet(false)}} buttons={optionsData}></IonActionSheet>
        </>
    )
};

export default SectionItem
