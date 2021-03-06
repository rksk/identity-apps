/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AlertLevels, BasicProfileInterface, ProfileSchema } from "../../models";
import { GlobalConfig, i18n } from "../../configs";
import { authenticateActionTypes, AuthAction } from "./types";
import { getProfileInfo, getProfileSchemas } from "../../api";
import { setProfileInfoLoader, setProfileSchemaLoader } from "./loaders";
import { ClientInteface, IdentityClient } from "@wso2is/authentication";
import _ from "lodash";
import { addAlert } from "./global";
import { getProfileCompletion } from "../../utils";
import { history } from "../../helpers";
import { store } from "../index";

/**
 * Dispatches an action of type `SET_SIGN_IN`.
 */
export const setSignIn = (): AuthAction => ({
    type: authenticateActionTypes.SET_SIGN_IN
});

/**
 * Dispatches an action of type `SET_SIGN_OUT`.
 */
export const setSignOut = (): AuthAction => ({
    type: authenticateActionTypes.SET_SIGN_OUT
});

/**
 * Dispatches an action of type `RESET_AUTHENTICATION`.
 */
export const resetAuthentication = (): AuthAction => ({
    type: authenticateActionTypes.RESET_AUTHENTICATION
});

/**
 * Dispatches an action of type `SET_PROFILE_INFO`.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const setProfileInfo = (details: any): AuthAction => ({
    payload: details,
    type: authenticateActionTypes.SET_PROFILE_INFO
});

/**
 * Dispatches an action of type `SET_SCHEMAS`
 * @param schemas
 */
export const setScimSchemas = (schemas: ProfileSchema[]): AuthAction => ({
    payload: schemas,
    type: authenticateActionTypes.SET_SCHEMAS
});

/**
 * Get SCIM2 schemas
 */
export const getScimSchemas = (profileInfo: BasicProfileInterface = null) => (dispatch): void => {
    dispatch(setProfileSchemaLoader(true));

    getProfileSchemas()
        .then((response: ProfileSchema[]) => {
            dispatch(setProfileSchemaLoader(false));
            dispatch(setScimSchemas(response));

            if (profileInfo) {
                dispatch(getProfileCompletion(profileInfo, response));
            }
        })
        .catch(() => {
            // TODO: show error page
        });
};

/**
 *  Gets profile information by making an API call
 */
export const getProfileInformation = (updateProfileCompletion = false) => (dispatch): void => {

    let isCompletionCalculated = false;

    dispatch(setProfileInfoLoader(true));

    // Get the profile info
    getProfileInfo()
        .then((infoResponse) => {
            if (infoResponse.responseStatus === 200) {
                dispatch(
                    setProfileInfo({
                        ...infoResponse
                    })
                );

                // If the schemas in the redux store is empty, fetch the SCIM schemas from the API.
                if (_.isEmpty(store.getState().authenticationInformation.profileSchemas)) {
                    isCompletionCalculated = true;
                    dispatch(getScimSchemas(infoResponse));
                }

                // If `updateProfileCompletion` flag is enabled, update the profile completion.
                if (updateProfileCompletion && !isCompletionCalculated) {
                    getProfileCompletion(infoResponse, store.getState().authenticationInformation.profileSchemas);
                }

                return;
            }

            dispatch(
                addAlert({
                    description: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.message"
                    )
                })
            );
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.detail) {
                dispatch(
                    addAlert({
                        description: i18n.t(
                            "views:components.profile.notifications.getProfileInfo.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: i18n.t(
                            "views:components.profile.notifications.getProfileInfo.error.message"
                        )
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: i18n.t(
                        "views:components.profile.notifications.getProfileInfo.genericError.message"
                    )
                })
            );
        })
        .finally(() => {
            dispatch(setProfileInfoLoader(false));
        });
};

/**
 * Initialize identityManager client
 */
const identityManager = (() => {
    let instance: ClientInteface;

    const createInstance = () => {
        return new IdentityClient({
            callbackURL: window["AppUtils"].getConfig().loginCallbackURL,
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            responseMode: process.env.NODE_ENV === "production" ? "form_post" : null,
            serverOrigin: window["AppUtils"].getConfig().serverOrigin,
            tenant: window["AppUtils"].getConfig().tenant,
            tenantPath: window["AppUtils"].getConfig().tenantPath
        });
    };
 
    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }

            return instance;
        }
    };
})();

/**
 * Handle user sign-in
 */
export const handleSignIn = () => (dispatch) => {
    identityManager.getInstance().signIn(
        () => {
            dispatch(setSignIn());
            dispatch(getProfileInformation());
        })
        .catch((error) => {
            // TODO: Show error page
            throw error;
        });
};

/**
 * Handle user sign-out
 */
export const handleSignOut = () => (dispatch) => {
    identityManager.getInstance().signOut(
        () => {
            dispatch(setSignOut());
        })
        .catch(() => {
            history.push(GlobalConfig.appLoginPath);
        });
};
