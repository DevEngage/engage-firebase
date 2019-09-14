
import EngageTrigger from '../../src/trigger/trigger';

new EngageTrigger('events/{eventId}/{subCollection}/{subId}')
    .bindExports(exports)
    .enableAnalytics([
        {
            trigger: 'events/{eventId}/attendees/{attendeeId}', //  event = { $id: 'asdfasdf', name: 'test', groupId: '234sdf' }; attendee = { $id: 'asdfasdf', name: 'test', userId: '234sdf' }
            validation: [{ isGuest: true }],
            group: { guests: { isGuest: true, }, members: { isGuest: false, } },
            destination: 'groups/{groupId}/$analytics',
            field: '', // blank = doc creation counter
        }
    ])
    .addRelations([
        {
            collection: 'groups/{groupId}',
            destination: 'groups/{groupId}/$analytics',
            field: '',
            sync: true, // when group doc changes that is propigated to events sub collections
            group: 'groupId',
        }
    ])
    .onWrite();

new EngageTrigger('groups/{groupId}')
    .bindExports(exports)
    .onWrite();