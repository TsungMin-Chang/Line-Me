// server side
import ChatBlock from "./_components/ChatBlock";

import { auth } from "@/lib/auth";

const ChatsPage = async () => {
  const session = await auth()
  console.log(session);

  if (!session) {
    // Redirect to the sign-in page if the user is not authenticated
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // const { data } = session;
  // console.log(user);
  // const { id, username, email, provider, picture } = user;  
  
  // const chatblocks = await db
  // .select({
  //   id: affairsTable.id,
  //   title: affairsTable.title,
  //   color: affairsTable.color,
  //   type: affairsTable.type,
  //   time1: affairsTable.time1,
  //   time2: affairsTable.time2,
  //   isDone: affairsTable.isDone,
  //   order: affairsTable.order,
  //   monthNumber: affairsTable.monthNumber,
  //   weekNumber: affairsTable.weekNumber,
  //   dayNumber: affairsTable.dayNumber,
  // })
  // .from(affairsTable)
  // .where(
  //   and(
  //     eq(affairsTable.userId, userId),
  //     eq(affairsTable.dayNumber, dayNumberInt),
  //     eq(affairsTable.type, "todo"),
  //   ),
  // )
  // .orderBy(asc(affairsTable.time2))
  // .execute();

  return (
    <>
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <ChatBlock index={i + 1} key={i} />
        ))}
    </>
  );
}
export default ChatsPage;
