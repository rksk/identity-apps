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

import { DocumentationConstants } from "@wso2is/core/constants";
import {
    CommonDeploymentConfigInterface,
    DocumentationProviders,
    DocumentationStructureFileTypes
} from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import { I18nConstants, ServerConfigurationsConstants } from "../constants";
import { ServiceResourceEndpointsInterface, UIConfigInterface } from "../models";

/**
 * Class to handle application config operations.
 */
export class Config {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Get the deployment config.
     *
     * @return {CommonDeploymentConfigInterface} Deployment config object.
     */
    public static getDeploymentConfig(): CommonDeploymentConfigInterface {
        return {
            appBaseName: window["AppUtils"].getConfig().appBaseWithTenant,
            appBaseNameWithoutTenant: window["AppUtils"].getConfig().appBase,
            appHomePath: window["AppUtils"].getConfig().routes.home,
            appLoginPath: window["AppUtils"].getConfig().routes.login,
            applicationName: window["AppUtils"].getConfig().ui.appName,
            clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
            clientID: window["AppUtils"].getConfig().clientID,
            clientOrigin: window["AppUtils"].getConfig().clientOrigin,
            documentation: {
                baseURL: window["AppUtils"].getConfig().documentation?.baseURL
                    ?? DocumentationConstants.GITHUB_API_BASE_URL,
                contentBaseURL: window["AppUtils"].getConfig().documentation?.contentBaseURL
                    ?? DocumentationConstants.DEFAULT_CONTENT_BASE_URL,
                githubOptions: {
                    branch: window["AppUtils"].getConfig().documentation?.githubOptions?.branch
                        ?? DocumentationConstants.DEFAULT_BRANCH
                },
                imagePrefixURL: window["AppUtils"].getConfig().documentation?.imagePrefixURL
                    ?? DocumentationConstants.DEFAULT_IMAGE_PREFIX_URL,
                provider: window["AppUtils"].getConfig().documentation?.provider
                    ?? DocumentationProviders.GITHUB,
                structureFileType: window["AppUtils"].getConfig().documentation?.structureFileType
                    ?? DocumentationStructureFileTypes.YAML,
                structureFileURL: window["AppUtils"].getConfig().documentation?.structureFileURL
                    ?? DocumentationConstants.DEFAULT_STRUCTURE_FILE_URL
            },
            loginCallbackUrl: window["AppUtils"].getConfig().loginCallbackURL,
            productVersion: window["AppUtils"].getConfig().productVersion,
            serverHost: window["AppUtils"].getConfig().serverOriginWithTenant,
            serverOrigin: window["AppUtils"].getConfig().serverOrigin,
            tenant: window["AppUtils"].getConfig().tenant,
            tenantPath: window["AppUtils"].getConfig().tenantPath
        };
    }

    /**
     * Get i18n module config.
     *
     * @return {I18nModuleOptionsInterface} i18n config object.
     */
    public static getI18nConfig(): I18nModuleOptionsInterface {
        return {
            initOptions: I18nConstants.MODULE_INIT_OPTIONS,
            langAutoDetectEnabled: I18nConstants.LANG_AUTO_DETECT_ENABLED,
            namespaceDirectories: I18nConstants.BUNDLE_NAMESPACE_DIRECTORIES,
            overrideOptions: I18nConstants.INIT_OPTIONS_OVERRIDE,
            resourcePath: "/resources/i18n",
            xhrBackendPluginEnabled: I18nConstants.XHR_BACKEND_PLUGIN_ENABLED
        };
    }

    /**
     * Get the the list of service resource endpoints.
     *
     * @return {ServiceResourceEndpointsInterface} Service resource endpoints as an object.
     */
    public static getServiceResourceEndpoints(): ServiceResourceEndpointsInterface {
        return {
            accountDisabling: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
            }/connectors/${ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID}`,
            accountLocking: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
            }/connectors/${ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID}`,
            accountRecovery: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID
            }/connectors/${ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID}`,
            applications: `${this.getDeploymentConfig().serverHost}/api/server/v1/applications`,
            associations: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/associations`,
            authorize: `${this.getDeploymentConfig().serverHost}/oauth2/authorize`,
            bulk: `${this.getDeploymentConfig().serverHost}/scim2/Bulk`,
            captchaForSSOLogin: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
            }/connectors/${ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID}`,
            certificates: `${this.getDeploymentConfig().serverHost}/api/server/v1/keystores/certs`,
            challengeAnswers: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/challenge-answers`,
            challenges: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/challenges`,
            claims: `${this.getDeploymentConfig().serverHost}/api/server/v1/claim-dialects`,
            clientCertificates: `${this.getDeploymentConfig().serverHost}/api/server/v1/keystores/client-certs`,
            consents: `${this.getDeploymentConfig()}/api/identity/consent-mgt/v1.0/consents`,
            documentationContent: this.getDeploymentConfig().documentation.contentBaseURL,
            documentationStructure: this.getDeploymentConfig().documentation.structureFileURL,
            emailTemplateType: `${this.getDeploymentConfig().serverHost}/api/server/v1/email/template-types`,
            externalClaims:`${this.getDeploymentConfig().serverHost}/api/server/v1/claim-dialects/{}/claims`,
            groups: `${this.getDeploymentConfig().serverHost}/scim2/Groups`,
            identityProviders: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-providers`,
            issuer: `${this.getDeploymentConfig().serverHost}/oauth2/token`,
            jwks: `${this.getDeploymentConfig().serverHost}/oauth2/jwks`,
            localAuthenticators: `${this.getDeploymentConfig().serverHost}/api/server/v1/configs/authenticators`,
            localClaims: `${this.getDeploymentConfig().serverHost}/api/server/v1/claim-dialects/local/claims`,
            loginPolicies: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
            }`,
            logout: `${this.getDeploymentConfig().serverHost}/oidc/logout`,
            // TODO: Remove this endpoint and use ID token to get the details
            me: `${this.getDeploymentConfig().serverHost}/scim2/Me`,
            passwordHistory: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
            }/connectors/${ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID}`,
            passwordPolicies: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
            }`,
            passwordPolicy: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
            }/connectors/${ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID}`,
            permission: `${this.getDeploymentConfig().serverHost}/api/server/v1/permission-management/permissions`,
            profileSchemas: `${this.getDeploymentConfig().serverHost}/scim2/Schemas`,
            publicCertificates: `${this.getDeploymentConfig().serverHost}/api/server/v1/keystores/certs/public`,
            requestPathAuthenticators:
                `${this.getDeploymentConfig().serverHost}/api/server/v1/configs/authenticators?type=REQUEST_PATH`,
            revoke: `${this.getDeploymentConfig().serverHost}/oauth2/revoke`,
            saml2Meta: `${this.getDeploymentConfig().serverHost}/identity/metadata/saml2`,
            selfSignUp: `${this.getDeploymentConfig().serverHost}/api/server/v1/identity-governance/${
                ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID
            }/connectors/${ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID}`,
            serverConfigurations: `${this.getDeploymentConfig().serverHost}/api/server/v1/configs`,
            sessions: `${this.getDeploymentConfig().serverHost}/api/users/v1/me/sessions`,
            token: `${this.getDeploymentConfig().serverHost}/oauth2/token`,
            user: `${this.getDeploymentConfig().serverHost}/api/identity/user/v1.0/me`,
            userStores: `${this.getDeploymentConfig().serverHost}/api/server/v1/userstores`,
            users: `${this.getDeploymentConfig().serverHost}/scim2/Users`,
            wellKnown: `${this.getDeploymentConfig().serverHost}/oauth2/oidcdiscovery/.well-known/openid-configuration`
        };
    }

    /**
     * Get UI config.
     *
     * @return {UIConfigInterface} UI config object.
     */
    public static getUIConfig(): UIConfigInterface {
        return {
            copyrightText: `${window["AppUtils"].getConfig().ui.appCopyright} \u00A9 ${ new Date().getFullYear() }`,
            doNotDeleteApplications: window["doNotDeleteApplications"] || [],
            doNotDeleteIdentityProviders: window["doNotDeleteIdentityProviders"] || [],
            titleText: window["AppUtils"].getConfig().appTitle
        };
    }
}
