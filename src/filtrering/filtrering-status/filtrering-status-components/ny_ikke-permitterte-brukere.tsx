import React from "react";
import { IKKE_PERMITTERTE_ETTER_NIENDE_MARS } from "../../filter-konstanter";
import { useStatusTallSelector } from "../../../hooks/redux/use-statustall";
import NyBarInputCheckbox from "../../../components/barinput/ny_barinput-checkbox";

export interface FiltreringStatusGruppe {
  ferdigfilterListe: string[];
  handleChange: (e: any) => void;
}

function NyFiltreringStatusIkkePermitterteEtterNiendeBrukere(
  props: FiltreringStatusGruppe
) {
  const statusTall = useStatusTallSelector();

  return (
    <NyBarInputCheckbox
      filterNavn="ikkePermitterteEtterNiendeMars"
      antall={statusTall.ikkePermitterteEtterNiendeMars}
      handleChange={props.handleChange}
      checked={props.ferdigfilterListe.includes(
        IKKE_PERMITTERTE_ETTER_NIENDE_MARS
      )}
      labelTekst={
        <>
          Alle <b>utenom</b> permitterte etter 09.03.2020
        </>
      }
    />
  );
}

export default NyFiltreringStatusIkkePermitterteEtterNiendeBrukere;
