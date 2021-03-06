/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Divider, Grid, Header, Image, Segment } from "semantic-ui-react";
import { deleteADialect, getADialect, getAllExternalClaims } from "../../api";
import {
    AvatarBackground,
    EditDialectDetails,
    EditExternalClaims
} from "../../components";
import { CLAIM_DIALECTS_PATH } from "../../constants";
import { history } from "../../helpers";
import { PageLayout } from "../../layouts"
import { AlertLevels, ClaimDialect, ExternalClaim } from "../../models";

/**
 * Props for the External Dialects edit page.
 */
type ExternalDialectEditPageInterface = TestableComponentInterface

/**
 * Route parameters interface.
 */
interface RouteParams {
    id: string;
}

/**
 * This renders the edit external dialect page
 *
 * @param {ExternalDialectEditPageInterface & RouteComponentProps<RouteParams>} props - Props injected to the component
 *
 * @return {React.ReactElement}
 */
export const ExternalDialectEditPage: FunctionComponent<ExternalDialectEditPageInterface> = (
    props: ExternalDialectEditPageInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const dialectId = match.params.id;

    const [ dialect, setDialect ] = useState<ClaimDialect>(null);
    const [ claims, setClaims ] = useState<ExternalClaim[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ confirmDelete, setConfirmDelete ] = useState(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setConfirmDelete(false) }
            type="warning"
            open={ confirmDelete }
            assertion={ dialect.dialectURI }
            assertionHint={
                <p>
                <Trans i18nKey="devPortal:components.claims.dialects.confirmations.hint">
                        Please type <strong>{ { confirm: dialect.dialectURI } }</strong> to confirm.
                    </Trans>
                </p>
            }
            assertionType="input"
            primaryAction={ t("devPortal:components.claims.dialects.confirmations.action") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => setConfirmDelete(false) }
            onPrimaryActionClick={ (): void => deleteDialect(dialect.id) }
            data-testid={ `${ testId }-delete-confirmation-modal` }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                { t("devPortal:components.claims.dialects.confirmations.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("devPortal:components.claims.dialects.confirmations.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
                { t("devPortal:components.claims.dialects.confirmations.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Fetch the dialect.
     */
    const getDialect = () => {
        getADialect(dialectId).then(response => {
            setDialect(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("devPortal:components.claims.dialects.notifications." +
                            "fetchADialect.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message 
                        || t("devPortal:components.claims.dialects.notifications." +
                            "fetchADialect.genericError.message")
                }
            ));
        })
    };

    useEffect(() => {
        getDialect();
    }, [ dialectId ]);

    /**
     * Fetch external claims.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     */
    const getExternalClaims = (limit?: number, offset?: number, sort?: string, filter?: string) => {
        dialectId && setIsLoading(true);
        dialectId && getAllExternalClaims(dialectId, {
            filter,
            limit,
            offset,
            sort
        }).then(response => {
            setClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("devPortal:components.claims.dialects.notifications." +
                            "fetchExternalClaims.genericError.description") ,
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("devPortal:components.claims.dialects.notifications." +
                            "fetchExternalClaims.genericError.message") 
                }
            ));
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        getExternalClaims();
    }, [ dialectId ]);

    /**
     * This generates the first letter of a dialect
     * @param {string} name 
     * @return {string} The first letter of a dialect
     */
    const generateDialectLetter = (name: string): string => {
        const stringArray = name.replace("http://", "").split("/");
        return stringArray[ 0 ][ 0 ].toLocaleUpperCase();
    };

    /**
     * This deletes a dialect
     * @param {string} dialectID 
     */
    const deleteDialect = (dialectID: string) => {
        deleteADialect(dialectID).then(() => {
            history.push(CLAIM_DIALECTS_PATH);
            dispatch(addAlert(
                {
                    description: t("devPortal:components.claims.dialects.notifications." +
                        "deleteDialect.success.description") ,
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.claims.dialects.notifications." +
                        "deleteDialect.success.message")
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("devPortal:components.claims.dialects.notifications." +
                            "deleteDialect.genericError.description") ,
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("devPortal:components.claims.dialects.notifications." +
                            "deleteDialect.genericError.message")
                }
            ));
        })
    };

    return (
        <PageLayout
            isLoading={ isLoading }
            image={
                <Image
                    floated="left"
                    verticalAlign="middle"
                    rounded
                    centered
                    size="tiny"
                >
                    <AvatarBackground />
                    <span className="claims-letter">
                        { dialect && generateDialectLetter(dialect.dialectURI) }
                    </span>
                </Image>
            }
            title={ dialect?.dialectURI }
            description={ t("devPortal:components.claims.dialects.pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(CLAIM_DIALECTS_PATH);
                },
                text: t ("devPortal:components.claims.dialects.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >

            <Divider />

            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <Header as="h5">
                            { t("devPortal:components.claims.dialects.pageLayout.edit.updateDialectURI") }
                        </Header>
                        <EditDialectDetails
                            dialect={ dialect }
                            data-testid={ `${ testId }-edit-dialect-details` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider hidden />
            <Divider />
            <Grid columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Header as="h5">
                        { t("devPortal:components.claims.dialects.pageLayout.edit.updateExternalAttributes") }
                    </Header>
                </Grid.Column>
            </Grid>

            <Divider hidden />

            <Segment>
                <EditExternalClaims
                    dialectID={ dialectId }
                    isLoading={ isLoading }
                    claims={ claims }
                    update={ getExternalClaims }
                    data-testid={ `${ testId }-edit-external-claims` }
                />
            </Segment>

            <Divider hidden />

            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <DangerZoneGroup
                            sectionHeader={ t("common:dangerZone") }
                            data-testid={ `${ testId }-danger-zone-group` }
                        >
                            <DangerZone
                                actionTitle={ t("devPortal:components.claims.dialects.dangerZone.actionTitle") }
                                header={ t("devPortal:components.claims.dialects.dangerZone.header") }
                                subheader={ t("devPortal:components.claims.dialects.dangerZone.subheader") }
                                onActionClick={ () => setConfirmDelete(true) }
                                data-testid={ `${ testId }-dialect-delete-danger-zone` }
                            />
                        </DangerZoneGroup>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { confirmDelete && deleteConfirmation() }
        </PageLayout>
    )
};

/**
 * Default props for the component.
 */
ExternalDialectEditPage.defaultProps = {
    "data-testid": "external-dialect-edit"
};
