import React, { useState, useEffect } from 'react';

const ProfilePage = (props) => {
  const {
    account,
    balance,
    fundAmount,
    connectWallet,
    fundWallet,
    refresh,
  } = props;
  const [posts, setPosts] = useState(null);
  const getWPosts = async () => {
    // TODO: handle ReadableStream returned from fetch
    // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
    try {
      return await fetch(`${process.env.REACT_APP_WP_BASE_URL}/posts`)
        .then((res) => res.body)
        .then((rb) => {
          const reader = rb.getReader();
          return new ReadableStream({
            start(controller) {
              // this handles each data chunk
              const push = () => {
                // "done" is a Boolean and value a "Uint8Array"
                reader.read().then(({ done, value }) => {
                  // true if no more data to read
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Get the data and send it to the browswer via controller
                  controller.enqueue(value);
                  push();
                });
              }
              push();
            }
          });
        })
        .then((stream) => {
          // response with above stream's text
          return new Response(stream, { headers: {
            "Content-Type": "text/html",
          }}).text();
        })
        .then((result) => {
          // return some json
          // console.log('here we are with the result', result);
          console.log('json', JSON.parse(result));
          return JSON.parse(result);
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    const giveMeWPPosts = async () => {
      const result = await getWPosts();
      console.log('give me the future', result);
      return result;
    }
    console.log('the posts before usefect loop: ', posts);
    if (posts === null) {
      const thePosts = giveMeWPPosts();
      console.log('useeffect', thePosts);
      if (thePosts) {
        console.log('if the posts: ', thePosts);
        setPosts(thePosts);
      }
    }
  }, [posts]);
  console.log('the posts in state', posts);
  const whatIsPosts = () => {
    console.log('posts rn ', posts);
  };
  // console.log('pfol page props', props);
  return (
    <div>
      {refresh ? <div>Loading</div> : (
        <>
          {account?.current ? (
            <>
              {balance?.current !== null
                ? <div>Current Balance: {`${balance.current}`}</div>
                : null}
              <br />
              <input title="Fund Amount" onChange={e => fundAmount.current = e.target.value} />
              <button onClick={fundWallet}>fund wallet</button>
            </>
          ) : (
            <>
              <div>No Wallet Connected</div>
              <button onClick={connectWallet}>connect wallet</button>
              <button onClick={whatIsPosts}>posts?</button>
            </>
          )}
        </>
      )}
      {Array.isArray(posts) && posts?.length > 0
        ? (
          <ul>
            {posts?.map((p) => (
              <li>{`${p.title.rendered} : ${p.content.rendered}`}</li>
            ))}
          </ul>
        ) : null}
    </div>
  );
}

export default ProfilePage;
