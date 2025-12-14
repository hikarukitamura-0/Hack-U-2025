// react-tinder-cardの型宣言モジュール
declare module 'react-tinder-card' {
    import React from 'react';

    export interface TinderCardProps {
        onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
        onCardLeftScreen?: (direction: string) => void;
        preventSwipe?: string[];
        children?: React.ReactNode;
        // その他、使用する可能性があるプロパティを追加
        className?: string;
        style?: React.CSSProperties;
    }

    const TinderCard: React.FC<TinderCardProps>;
    export default TinderCard;
}