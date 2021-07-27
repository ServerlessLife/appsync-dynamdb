import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AppSyncResolverEvent } from "aws-lambda";
import { Todo } from "../../model/Todo";
import { createDynamoDbClient } from "../../util/createDynamoDbClient";

export const handler = async (event : AppSyncResolverEvent<{ userKey: string }>) : Promise<Todo[]> => {
  console.log(JSON.stringify(event, null, 2));

  const client = createDynamoDbClient();
  const ddbDocClient = DynamoDBDocumentClient.from(client); 

  const data = await ddbDocClient.send(
    new ScanCommand(
      {
        TableName : process.env.DYNAMODB_TABLE,
      }
    )
  );

  const list =  data.Items.map(i => (<Todo>{
    id: i.id?.S,
    name: i.name?.S,
    order: i.order?.N as any
  }));

  return list;
}