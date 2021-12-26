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
    const thePosts = await fetch(`${process.env.REACT_APP_WP_BASE_URL}/posts`)
      .then((res) => {
        console.log('then res', res);
      });
    return thePosts;
  };

  useEffect(() => {
    if (posts === null) {
      const thePosts = getWPosts();
      if (thePosts) {
        setPosts(thePosts);
      }
    }
  }, [posts]);
  console.log('the posts in state', posts);
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
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
