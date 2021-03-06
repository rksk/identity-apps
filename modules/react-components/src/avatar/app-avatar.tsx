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

import { TestableComponentInterface } from "@wso2is/core/models";
import { OrangeAppIconBackground } from "@wso2is/theme";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Avatar, AvatarPropsInterface } from "./avatar";

/**
 * Prop types for the App Avatar component.
 */
export interface AppAvatarPropsInterface extends AvatarPropsInterface, TestableComponentInterface {
    /**
     * If the avatar is placed on a card.
     */
    onCard?: boolean;
}

/**
 * App Avatar component.
 *
 * @param {AvatarPropsInterface} props - Props injected in to the app avatar component.
 *
 * @return {React.ReactElement}
 */
export const AppAvatar: FunctionComponent<AppAvatarPropsInterface> = (
    props: AppAvatarPropsInterface
): ReactElement => {

    const {
        image,
        className,
        name,
        onCard,
        [ "data-testid" ]: testId
    } = props;

    const appAvatarClassNames = classNames({
        [ "bg-image" ]: !onCard,
        [ "default-app-icon" ]: onCard
    }, className);

    if (image) {
        return (
            <Avatar
                avatarType="app"
                avatar
                className="with-app-image"
                image={ image }
                bordered={ false }
                data-testid={ testId }
                { ...props }
            />
        );
    }

    return (
        <Avatar
            avatarType="app"
            className={ appAvatarClassNames }
            style={ onCard ? {} : { backgroundImage: `url(${ OrangeAppIconBackground })` } }
            bordered
            avatar
            name={ name }
            data-testid={ testId }
            { ...props }
        />
    );
};

/**
 * Default proptypes for the App avatar component.
 */
AppAvatar.defaultProps = {
    "data-testid": "app-avatar",
    image: null,
    name: null,
    onCard: false
};
