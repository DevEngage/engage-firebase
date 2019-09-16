
import EngageTrigger from '../../src/trigger/trigger';




new EngageTrigger('events/{eventId}/attendees/{attendeeId}')
    .bindExports(exports)
    .enableAnalytics([
        {
            trigger: 'events/{eventId}/attendees/{attendeeId}', //  event = { $id: 'asdfasdf', name: 'test', groupId: '234sdf' }; attendee = { $id: 'asdfasdf', name: 'test', userId: '234sdf' }
            group: [
                { 
                    field: 'guests',
                    fieldValue: 'spent',
                    filter: { isGuest: true}, //, $greater__field: 100, $lesser__field: 100
                    action: 'add'
                }, {
                    field: 'members',
                    filter: { isGuest: false, } 
                }
            ],
            destination: 'groups/{groupId}',
        }
    ])
    // .addRelations([
    //     {
    //         collection: 'groups/{groupId}',
    //         destination: 'groups/{groupId}',
    //         field: '',
    //         sync: true, // when group doc changes that is propigated to events sub collections
    //         group: 'groupId',
    //     }
    // ])
    .onWrite();

new EngageTrigger('groups/{groupId}')
    .bindExports(exports)
    .onWrite();