import { gql } from "@apollo/client";

export const ASSOCIATION_SEEN_NOTIFICATION = gql`
mutation Association_seen_notification($notificationIds: [ID!]!) {
    association_seen_notification(notificationIds: $notificationIds) {
        msg
        status
    }
}`;