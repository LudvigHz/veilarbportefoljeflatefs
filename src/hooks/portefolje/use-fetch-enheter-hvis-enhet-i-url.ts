import { useState } from "react";
import {useQueryParams} from "../use-query-params";
import {velgEnhetForVeileder} from "../../ducks/valgt-enhet";
import {useDispatch} from "react-redux";
import {useOnMount} from "../use-on-mount";


export interface Enheter {
    ident: string;
    enhetliste: {enhetId: string, navn: string}[]
}

export function useFetchEnheter() {
    const [isLoading, setLoading] = useState(true);
    const [manglerEnheter, setManglerEnheter ]= useState(false);

    const dispatch = useDispatch();

    const enhetId = useQueryParams().enhet;

    useOnMount(() => {
        fetch("/veilarbveileder/api/veileder/enheter")
            .then(resp => resp.json())
            .then((resp: Enheter) => {
                if(enhetId) {
                    if (resp.enhetliste.findIndex(enhet => enhet.enhetId === enhetId) >= 0) {
                        dispatch(velgEnhetForVeileder(enhetId));
                    }
                }
                else {
                    if(resp.enhetliste.length === 0 ) {
                        setManglerEnheter(true);
                    }
                }
                setLoading(false)
            })
            .catch(_ => setLoading(false));
    });

    return {isLoading, manglerEnheter}
}