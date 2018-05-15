var list = [
        {
            name: 'Millenial Streamers - Tier 3',
            audience_id: '111131',
            priority: 1,
        },
        {
            name: 'Switch - Tier 3',
            audience_id: '111111',
            priority: 2,
        },
        {
            name: 'Lead Score - Bundle - Tier 3',
            audience_id: '111112',
            priority: 3,
        },
        {
            name: 'Lead Score - Internet - Tier 3',
            audience_id: '111113',
            priority: 4,
        },
        {
            name: 'Millenial Streamers - Tier 2',
            audience_id: '111130',
            priority: 5,
        },
        {
            name: 'Switch - Tier 2',
            audience_id: '111114',
            priority: 6,
        },
        {
            name: 'Lead Score - Bundle - Tier 2',
            audience_id: '111115',
            priority: 7,
        },
        {
            name: 'Lead Score - Internet - Tier 2',
            audience_id: '111116',
            priority: 8,
        },
        {
            name: 'Millenial Streamers - Tier 1',
            audience_id: '111129',
            priority: 9,
        },
        {
            name: 'Small Markets',
            audience_id: '111118',
            priority: 10,
        },
        {
            name: 'Cyber Strivers - Tier 1',
            audience_id: '111123',
            priority: 11,
        },
        {
            name: 'Movers - Tier 1',
            audience_id: '111120',
            priority: 12,
        },
        {
            name: '2P/3P Look-a-like',
            audience_id: '111117',
            priority: 13,
        },
        {
            name: '1P Internet Look-a-like',
            audience_id: '111119',
            priority: 14,
        }
],
qualified_audiences = ['111119', '111123', '111114', '2P/3P Look-a-like'], //Accepts Segment Name or Audience ID from origin.
sorted_audience = list.filter(function (obj) {
    return (qualified_audiences.indexOf(obj.name) > -1 || qualified_audiences.indexOf(obj.audience_id) > -1);
}).sort(function(a,b){ return a.priority - b.priority; });

//Debugging
console.log('You are in these audiences:');
sorted_audience.forEach(function(obj) {
    console.log(obj.priority + ': ' + obj.name);
});
console.log('----------------------------');
/*
    sorted_audience[0] is the highest priority item of your current audience list in ascending order.
    use sorted_audience.reverse()[0] to for descending order
*/
console.log('You should be in audience:', sorted_audience[0]);