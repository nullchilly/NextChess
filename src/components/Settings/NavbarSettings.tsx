import Link from "next/link";

const ProfileNavbar = () => {
	return(
		<nav className="bg-[#477330] p-4 rounded-lg shadow-md">
			<div className="items-center justify-center mx-auto sp">
				<div className="flex md:flex md:space-x-4 mx-auto">
					<div key={0} className="flex-grow text-center text-slate-100 font-mono p-4 bg-[#58943c] hover:bg-[#4f8536] transition-colors rounded-lg">
						<Link href="/settings" className=""> Account </Link>
					</div>
					
					<div key={0} className="flex-grow text-center text-slate-100 font-mono p-4 hover:bg-[#4f8536] transition-colors rounded-lg">
						<Link href="/settings/password" className=""> Change Password</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}