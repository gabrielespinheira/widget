import React from "react";
import { createSafeContext } from "@react/utils/create-safe-context";
import { ReactNode, useEffect, useMemo } from "react";
import { useConfigData } from "./ConfigDataProvider";
import { useSyncedState } from "@react/hooks";
import { ConsumerType } from "@core/types";
import useAsyncFn from "react-use/lib/useAsyncFn";
import { UserObject } from "@react/types";

type T = ConsumerType;

function _useContact() {
    const { http, botToken, user, collectUserData } = useConfigData();
    const [contact, setContact] = useSyncedState<T | null>(`${botToken}:contact:${user.external_id}`, null, "local");
    const [creatingContactState, createContactAsync] = useAsyncFn(async (user: UserObject) => {
        try {
            if (!user || !user.email) return null;
            const dumpContactResponse = await http.apis.dumpContact(user);
            if (dumpContactResponse?.data?.id) {
                setContact(dumpContactResponse.data);
            }
            return dumpContactResponse?.data;
        } catch (error) {
            console.error(error);
        }
        return null
    }, [http.apis]);

    useEffect(() => {
        if (user && botToken) {
            createContactAsync(user)
        }
    }, [user, botToken]);

    const shouldCollectData = useMemo(() => {
        if (!contact?.id && collectUserData) {
            return {
                should: true,
                reason: "No contact id and collectUserData is true"
            }
        }
        return {
            should: false,
        }
    }, [contact])
    return {
        creatingContactState,
        createContactAsync,
        contact,
        shouldCollectData
    }
}

const [useContact, SafeContactProvider] = createSafeContext<ReturnType<typeof _useContact>>()

function ContactProvider({ children }: { children: ReactNode }) {
    const value = _useContact()
    return <SafeContactProvider value={value}>{children}</SafeContactProvider>
}

export { ContactProvider, useContact }