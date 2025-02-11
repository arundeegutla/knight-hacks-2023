'use client'; // This is a client component 👈🏽
import { User } from 'firebase/auth';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const FaUser = dynamic(() => import('react-icons/fa').then((mod) => mod.FaUser), {
	ssr: false, // Set to false to disable server-side rendering
});

const GiTrophyCup = dynamic(() => import('react-icons/gi').then((mod) => mod.GiTrophyCup), {
	ssr: false, // Set to false to disable server-side rendering
});

declare global {
	type MyUser = {
		username: string;
		photoURL: string;
		score: number;
	};
}

export default function ProfileComponent({
	profile,
	className,
}: {
	profile: MyUser;
	className: string;
}) {
	const getProfilePic = () => {
		if (!profile.photoURL)
			return <div style={{ fontSize: "100px" }}><FaUser /></div>;
		const url: string = profile.photoURL ?? 'https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/04/Jujutsu-Kaisen---Maki-Zenin.jpeg';

		return <Image width={0} height={0} alt='pfp' src={url} className="h-40 w-40 aspect-square rounded-full" />;
	};

	const getName = () => {
		if (!profile.username)
			return 'No Name';
		return profile.username;
	};

	return (
		<div className={className}>
			<div className="flex flex-row items-center w-[100%] h-[100%] rounded-2xl bg-white/[0.6] text-black p-8">
				<div>{getProfilePic()}</div>
				<div className="flex flex-col justify-center items-start ml-3">
					<div>
						<h1>Hi, {getName()}</h1>
					</div>

					<div>
						<div className="block">
							<div className="flex flex-row justify-center items-center ">
								<div className='flex flex-row items-center text-amber-500 bg-gray-700 rounded-md px-3 py-2 text-sm font-medium mb-2'>
									<div style={{ fontSize: "25px" }}><GiTrophyCup /></div>
									<h2 className='m-1'>{profile.score}</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
