// src/components/PopUp.tsx

import React from 'react';
import { Box, Button } from '@chakra-ui/react';

type PopUpProps = {
  onClose: () => void;
  src: string;
};

const PopUp: React.FC<PopUpProps> = ({ onClose, src }) => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      background="rgba(0, 0, 0, 0.5)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
    >
      <Box background="white" padding="20px" borderRadius="8px" maxWidth="80%">
        <iframe src={src} width="100%" height="600px" />
        <Button onClick={onClose} marginTop="20px" background="#f44336" color="white" _hover={{ background: "#d32f2f" }}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default PopUp;
