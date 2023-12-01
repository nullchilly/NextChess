import React from "react";

type ModalContainerProps = {
	isOpen: boolean;
	children: React.ReactNode;
};

const ModalContainer: React.FC<ModalContainerProps> = ({isOpen, children}) => {
	if (isOpen) {
		return (
			<div className='modal'>
				<div className='modal-content'>{children}</div>
			</div>
		)
	}
	
	return <></>
}

export default ModalContainer;