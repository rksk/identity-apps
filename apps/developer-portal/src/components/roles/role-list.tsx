/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton, PrimaryButton,
    ResourceList,
    ResourceListItem
} from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Image, Label } from "semantic-ui-react";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { APPLICATION_DOMAIN, GROUP_VIEW_PATH, INTERNAL_DOMAIN, ROLE_VIEW_PATH, UIConstants } from "../../constants";
import { history } from "../../helpers";
import { RolesInterface } from "../../models";
import { CommonUtils } from "../../utils";
import { AvatarBackground } from "../shared";

interface RoleListProps extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Flag for Group list.
     */
    isGroup: boolean;
    /**
     * Roles list.
     */
    roleList: RolesInterface[];
    /**
     * Role delete callback.
     * @param {RolesInterface} role - Deleting role.
     */
    handleRoleDelete: (role: RolesInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
    /**
     * Search query for the list.
     */
    searchQuery: string;
}

/**
 * List component for Role Management list
 * 
 * @param props contains the role list as a prop to populate
 */
export const RoleList: React.FunctionComponent<RoleListProps> = (props: RoleListProps): ReactElement => {
    
    const {
        handleRoleDelete,
        isGroup,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        roleList,
        searchQuery,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedRole, setCurrentDeletedRole ] = useState<RolesInterface>();

    const handleRoleEdit = (roleId: string) => {
        if (isGroup) {
            history.push(GROUP_VIEW_PATH + roleId);
        } else {
            history.push(ROLE_VIEW_PATH + roleId);
        }
    };

    /**
     * Util method to generate listing header content.
     * 
     * @param displayName - display name of the role/group
     *
     * @returns - React element if containing a prefix or the string
     */
    const generateHeaderContent = (displayName: string): ReactElement | string => {
        if (isGroup) {
            if (displayName.indexOf("/") !== -1){
                return (
                    <>
                        <Label
                            data-testid={ `${ testId }-group-${ displayName.split("/")[0] }-label` }
                            content={ displayName.split("/")[0] }
                            size="mini"
                            color="olive"
                            className={ "group-label" }
                        />
                        { "/ " + displayName.split("/")[1] }
                    </>
                )
            } else {
                return (
                    <>
                        <Label
                            data-testid={ `${ testId }-group-${ displayName }-label` }
                            content={ "Primary" }
                            size="mini"
                            color="teal"
                            className={ "primary-label" }
                        />
                        { "/ " + displayName }
                    </>
                );
            }
        } else {
            if (displayName.includes(APPLICATION_DOMAIN)) {
                return  <>
                            <Label
                                data-testid={ `${ testId }-role-${ displayName.split("/")[1] }-label` }
                                content={ "Application" }
                                size="mini"
                                className={ "application-label" }
                            />
                            { "/ " + displayName.split("/")[1] }
                        </>
            } else if (displayName.includes(INTERNAL_DOMAIN)) {
                return <>
                            <Label
                                data-testid={ `${ testId }-role-${ displayName.split("/")[1] }-label` }
                                content={ "Internal" }
                                size="mini"
                                className={ "internal-label" }
                            />
                            { "/ " + displayName.split("/")[1] }
                        </>
            }
        }
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ testId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("devPortal:components.roles.list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ t("devPortal:components.roles.list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("devPortal:components.roles.list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("devPortal:components.roles.list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (roleList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-list-empty-placeholder` }
                    action={ (
                        <PrimaryButton
                            data-testid={ `${ testId }-empty-list-empty-placeholder-add-button` }
                            onClick={ onEmptyListPlaceholderActionClick }
                        >
                            <Icon name="add"/>
                            { t("devPortal:components.roles.list.emptyPlaceholders.emptyRoleList.action",
                                { type: isGroup ? "Group" : "Role" })}
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ t("devPortal:components.roles.list.emptyPlaceholders.emptyRoleList.title",
                        { type: isGroup ? "group" : "role" }) }
                    subtitle={ [
                        t("devPortal:components.roles.list.emptyPlaceholders.emptyRoleList.subtitles.0",
                            { type: isGroup ? "groups" : "roles" }),
                        t("devPortal:components.roles.list.emptyPlaceholders.emptyRoleList.subtitles.1",
                            { type: isGroup ? "group" : "role" }),
                        t("devPortal:components.roles.list.emptyPlaceholders.emptyRoleList.subtitles.2",
                            { type: isGroup ? "group" : "role" })
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="roles-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
            >
                {
                    roleList && roleList instanceof Array && roleList.length > 0
                        ? roleList.map((role, index) => (
                            <ResourceListItem
                                data-testid={ `${ testId }-list-item-${ role.displayName }` }
                                key={ index }
                                actionsFloated="right"
                                actions={ [
                                    {
                                        icon: "pencil alternate",
                                        onClick: () => handleRoleEdit(role.id),
                                        popupText:
                                            isGroup
                                                ? t("devPortal:components.roles.list.popups.edit",
                                                    { type: "Group" })
                                                : t("devPortal:components.roles.list.popups.edit",
                                                    { type: "Role" }),
                                        type: "button"
                                    },
                                    {
                                        icon: "trash alternate",
                                        onClick: () => {
                                            setCurrentDeletedRole(role);
                                            setShowDeleteConfirmationModal(!showRoleDeleteConfirmation);
                                        },
                                        popupText:
                                            isGroup
                                                ? t("devPortal:components.roles.list.popups.delete",
                                                    { type: "Group" })
                                                : t("devPortal:components.roles.list.popups.delete",
                                                    { type: "Role" }),
                                        type: "button"
                                    }
                                ] }
                                avatar={ (
                                    <Image
                                        floated="left"
                                        verticalAlign="middle"
                                        rounded
                                        centered
                                        size="mini"
                                    >
                                        <AvatarBackground/>
                                        <span className="claims-letter">
                                            { role.displayName[ 0 ].toLocaleUpperCase() }
                                        </span>
                                    </Image>
                                ) }
                                itemHeader={ generateHeaderContent(role.displayName) }
                                metaContent={ CommonUtils.humanizeDateDifference(role.meta.created) }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
            {
                showRoleDeleteConfirmation && 
                    <ConfirmationModal
                        data-testid={ `${ testId }-delete-item-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showRoleDeleteConfirmation }
                        assertion={ currentDeletedRole.displayName }
                        assertionHint={ 
                            (
                                <p>
                                    <Trans
                                        i18nKey={ "devPortal:components.roles.list.confirmations.deleteItem." +
                                        "assertionHint" }
                                        tOptions={ { roleName: currentDeletedRole.displayName } }
                                    >
                                        Please type <strong>{ currentDeletedRole.displayName }</strong> to confirm.
                                    </Trans>
                                </p>
                            )
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => { 
                            handleRoleDelete(currentDeletedRole);
                            setShowDeleteConfirmationModal(false);
                        } }
                    >
                        <ConfirmationModal.Header>
                            { t("devPortal:components.roles.list.confirmations.deleteItem.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            { t("devPortal:components.roles.list.confirmations.deleteItem.message",
                                { type: isGroup ? "group" : "role" }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("devPortal:components.roles.list.confirmations.deleteItem.content",
                                { type: isGroup ? "group" : "role" }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
            }
        </>
    );
};
