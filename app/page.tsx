'use client';

import RootLayout from './layout';

import ProfileComponent from '@/components/Profile';

import { auth } from '@/firebase/clientApp';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '@/components/Loading';
import Friends from '@/components/Friends';
import RecentPlays from '@/components/RecentPlays';
import { Play, Profile, ProfileBasic } from '@/firebase/models';
import { useEffect, useState } from 'react';
import api from '@/firebase/api';

export default function Page() {
  const [user, loading, error] = useAuthState(auth);
  const [profileStatus, setProfileStatus] = useState(false);


  const router = useRouter();

  const [profile, setProfile] = useState({} as unknown as Profile);
  const [plays, setPlays] = useState([] as unknown as Play[]);
  const [friends, setFriends] = useState([] as unknown as ProfileBasic[]);

  const refresh = () => {
    if (!user || profileStatus) return;

    setProfileStatus(true);
    console.log(user.displayName);
    user.getIdTokenResult().then((idToken) => {
      api.createProfile(idToken.token, user.displayName || '', user.photoURL || '').then(
        (res) => {
          api.getProfileByToken(idToken.token).then((res) => {
            if (res.data.error === '') {
              const friendIds = res.data.profile.friends;
              setProfile(res.data.profile);
              setPlays(res.data.plays);
              api.userLeaderboard().then((res) => {
                if (res.data.error === '') {
                  const allProfiles = res.data
                    .results as ProfileBasic[];
                  setFriends(
                    allProfiles.filter((pb) =>
                      friendIds.includes(pb.id)
                    )
                  );
                }
              });
            }
          });
        }
      );
    });
  };

  useEffect(refresh, [profileStatus, user]);

  if (user) {
    if (!profileStatus && profile.totalScore === undefined) refresh();
  } else if (loading) {
    return <Loading />;
  } else {
    router.push('/auth');
    return;
  }

  return (
    <RootLayout>
      <div className="w-full flex flex-row items-center h-full justify-center">
        <div className='flex flex-row items-start'>
          <div className="flex flex-col items-stretch flex-wrap">
            <ProfileComponent
              className="profile my-blur my-hover rounded-2xl"
              profile={{ username: user.displayName || "", photoURL: user.photoURL || "", score: profile.totalScore || 0, }}
            ></ProfileComponent>
            <RecentPlays
              className="profile my-blur my-hover rounded-2xl"
              plays={plays}
            ></RecentPlays>
          </div>
          <div>
            <Friends
              className="profile my-blur my-hover rounded-2xl"
              friends={friends}
            ></Friends>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
