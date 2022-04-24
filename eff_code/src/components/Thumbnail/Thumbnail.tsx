import React, { ReactNode } from 'react';

type ThumbnailProps = {
    children?: ReactNode;
    bookPages?: object;
    selectPage?: Function;
    removePage?: Function;
    sortThumbnail?: Function;
    ui?:object;
};

type ThumbItemsProps = {
    children?: ReactNode;
};

export const Thumbnail = (props: ThumbnailProps) => {
    const { children } = props;

    const ThumbItems = (props: ThumbItemsProps) => {
        return (
          <li>
            <div>
              <span>
                123456
              </span>
            </div>
          </li>
        )
    }

    return (
      <div>
        <div>
          <ThumbItems></ThumbItems>
        </div>
      </div>
    )
};