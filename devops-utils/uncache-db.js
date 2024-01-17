const {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
// Constants
const tableName = 'srg-activities-table';
const partitionKey = 'athleteId';
const sortKey = 'activityId';
// To remove a column
// const attributeToRemove = 'individualEntryCached';
//
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

const updateItem = async (athleteId, activityId) => {
  const updateParams = {
    TableName: tableName,
    Key: {
      [partitionKey]: { S: athleteId },
      [sortKey]: { S: activityId },
    },

    UpdateExpression: 'SET individualActivityCached = :value',
    ExpressionAttributeValues: { ':value': { BOOL: false } },
    // To Remove a Column...
    // UpdateExpression: 'REMOVE #attr',
    // ExpressionAttributeNames: { '#attr': attributeToRemove },
  };

  try {
    await dynamoDbClient.send(new UpdateItemCommand(updateParams));
    console.log(
      `Item with ${partitionKey}=${athleteId} and ${sortKey}=${activityId} updated successfully.`
    );
  } catch (error) {
    console.error(
      `Error updating item with ${partitionKey}=${athleteId} and ${sortKey}=${activityId}:`,
      error
    );
  }
};

const scanAndUpdateItems = async () => {
  const scanParams = {
    TableName: tableName,
  };

  try {
    const scanCommand = new ScanCommand(scanParams);
    const scanResults = await dynamoDbClient.send(scanCommand);
    console.log(scanResults.Items.length);
    // Update each item
    for (const item of scanResults.Items) {
      const athleteId = item[partitionKey].S;
      const activityId = item[sortKey].S;
      console.log(athleteId, activityId);
      await updateItem(athleteId, activityId);
    }

    console.log('All items updated successfully.');
  } catch (error) {
    console.error('Error scanning table:', error);
  }
};

scanAndUpdateItems();
