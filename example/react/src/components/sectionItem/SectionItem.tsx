import React from "react";
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import {more} from "ionicons/icons";
import "./sectionItem.scss";

const SectionItem = ({label, optionsFunc, icon = null, src = null, stats = null}) => {

    return (
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
            <IonIcon className="end-icon" slot="end" icon={more} onClick={() => optionsFunc()}></IonIcon>
        </IonItem>
    )
};

export default SectionItem
