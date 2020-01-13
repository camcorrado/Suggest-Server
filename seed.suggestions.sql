INSERT INTO Suggestion (id, userId, title, content, date_published, date_modified, approved, date_approved, upvotes)
VALUES
  (
    1, 
    100, 
    'Fridays At Home', 
    'I think we should work from home on Fridays!', 
    'Fri Jan 03 2020', 
    'Tue Jan 07 2020',
    false,
    null,
    52
  ),
  (
    2,
    100,
    'Second Fridge',
    'I think we should have two fridges: one for municiple food and another for private food!',
    'Mon Jan 06 2020',
    null,
    true,
    'Thu Jan 09 2020',
    169
  ),
  (
    3,
    200,
    'More PTO',
    'We need more vacation time!',
    'Mon Jan 06 2020',
    null,
    true,
    'Tue Jan 07 2020',
    122
  ),
  (
    4,
    300,
    'Even More PTO',
    'We need even more vacation time!',
    'Wed Jan 08 2020',
    null,
    false,
    null,
    107
  ),       
  (
    5,
    200,
    'Holiday Party',
    "Let's celebrate the holidays next year to boost morale!",
    'Wed Jan 08 2020',
    null,
    true,
    'Thu Jan 09 2020',
    121
  ),          
  (
    6,
    400,
    'SodaStream',
    'There should be an office SodaStream!',
    'Wed Jan 08 2020',
    null,
    false,
    null,
    62
  ),
  (
    7,
    500,
    'Gaming Lounge',
    'A gaming lounge would be awesome for morale and during break time!',
    'Wed Jan 08 2020',
    'Thu Jan 09 2020',
    false,
    null,
    72
  ),
  (
    8,
    100,
    'Upgrade to Standing Desks',
    'Sitting all day is bad for your health!',
    'Thu Jan 09 2020',
    null,
    false,
    null,
    29
  ),          
  (
    9,
    600,
    'Office Gym',
    'We should install a gym to workout during breaks!',
    'Thu Jan 09 2020',
    null,
    false,
    true,
    103
  ),
  (
    10,
    700,
    'Genderless Bathrooms',
    'Get with the times! Gender is a social construct.',
    'Thu Jan 09 2020',
    null,
    true,
    'Thu Jan 09 2020',
    151
  );