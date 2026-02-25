import React from 'react';
import { Center, VStack, Box } from '@gluestack-ui/themed';
import { Typography } from './Typography';
import { Button } from './Button';
import { useTheme } from '../../hooks/useTheme';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = '🔍',
    actionLabel,
    onAction
}) => {
    const { colors } = useTheme();

    return (
        <Center flex={1} px="$10" py="$16">
            <VStack space="xl" alignItems="center" w="100%">
                <Box
                    w={100}
                    h={100}
                    borderRadius="$full"
                    bg={colors.surfaceHighlight}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography style={{ fontSize: 48 }}>{icon}</Typography>
                </Box>

                <VStack space="xs" alignItems="center">
                    <Typography variant="h2" align="center">
                        {title}
                    </Typography>
                    <Typography
                        variant="body"
                        color={colors.textSecondary}
                        align="center"
                        style={{ opacity: 0.7, lineHeight: 22 }}
                    >
                        {description}
                    </Typography>
                </VStack>

                {actionLabel && onAction && (
                    <Box mt="$8" w="100%" alignItems="center">
                        <Button
                            title={actionLabel}
                            onPress={onAction}
                            variant="primary"
                            fullWidth={false}
                            style={{ paddingHorizontal: 32, borderRadius: 16 }}
                        />
                    </Box>
                )}
            </VStack>
        </Center>
    );
};
