import React from "react";
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import {add} from "ionicons/icons";
import "./sectionHeader.scss";

const SectionHeader = ({label, addFunc, icon = null, src = null}) => {

    return (
        <IonItem lines="full" className="section-header">
            {icon && <IonIcon className="ion-padding-end" icon={icon}></IonIcon>}
            {src && <IonIcon className="ion-padding-end" src={src}></IonIcon>}
            <IonLabel>
                {label}
            </IonLabel>
            <IonIcon slot="end" icon={add} onClick={() => addFunc()}></IonIcon>
        </IonItem>
    )
};

export default SectionHeader
