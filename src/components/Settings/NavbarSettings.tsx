import Link from "next/link";

type SettingsNavbarProps = {
	key: boolean;
}

const SettingsNavbar : React.FC<SettingsNavbarProps> = (props) => {
	return(
		<nav className="bg-[#477330] p-4 rounded-lg shadow-md">
			<div className="items-center justify-center mx-auto sp">
				<div className="flex md:flex md:space-x-4 mx-auto">
					<div key={0} className={`flex-grow text-slate-100 font-mono p-4 hover:bg-[#4f8536] transition-colors rounded-lg ${props.key ? 'bg-[#58943c]' : ''}`  }>
						<Link href="/settings" className="">
							<div className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex justify-center">
								Account
							</div>
						</Link>
					</div>
					
					<div key={0} className={`flex-grow text-slate-100 font-mono p-4 hover:bg-[#4f8536] transition-colors rounded-lg ${props.key ? '' : 'bg-[#58943c]'}`  }>
						<Link href="/settings/password" className="">
							<div className="col-start-2 col-end-4 text-3xl text-slate-100 font-mono font-bold flex justify-center">
								Change Password
							</div>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default SettingsNavbar;