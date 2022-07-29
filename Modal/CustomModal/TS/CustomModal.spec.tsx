import React from 'react';
import { screen, render } from '@testing-library/react';

import CustomModal from './CustomModal';

const reactTestingCompWithRef = () => {
  let CustomModalRef: CustomModal | null = null;

  const openModal = () => {
    if (CustomModalRef)
      CustomModalRef.show({
        title: 'Modal Title',
        child: <div>This is modal content 2</div>,
        onClose: openModalTwo,
      });
  };

  const openModalTwo = () => {
    setTimeout(() => {
      if (CustomModalRef)
        CustomModalRef.show({
          child: <div>This is modal content 3</div>,
        });
    }, 10);
  };

  const closeModal = () => {
    if (CustomModalRef) CustomModalRef.close();
  };

  return (
    <div>
      <CustomModal
        ref={(r) => {
          CustomModalRef = r;
        }}
      />
      <div onClick={openModal}>Open Modal Button</div>
      <div>Outside of Modal</div>
      <div onClick={closeModal}>Close Modal Button</div>

      <CustomModal>
        <div>This is the type 1 modal content</div>
      </CustomModal>
    </div>
  );
};

describe('Testing Custom Modal', () => {
  it('test', async () => {
    render(reactTestingCompWithRef());

    expect(await screen.findByText('This is the type 1 modal content')).toBeInTheDocument();
    screen.getByText('Open Modal Button').click();
    expect(screen.getByText('This is modal content 2')).toBeInTheDocument();

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    screen.getByText('Close Modal Button').click();

    expect(screen.queryByText('This is modal content 2')).not.toBeInTheDocument();
    expect(await screen.findByText('This is modal content 3')).toBeInTheDocument();
  });
});
