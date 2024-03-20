import { TabSelector } from 'src/components/molecules';
import { CollateralTab } from 'src/components/organisms';
import { CollateralBook } from 'src/hooks';

const tabDataArray = [{ text: 'Asset Management' }];

export const CollateralOrganism = ({
    collateralBook,
    netAssetValue,
}: {
    collateralBook: CollateralBook;
    netAssetValue: number;
}) => {
    return (
        <div className='h-fit w-full'>
            <TabSelector tabDataArray={tabDataArray}>
                <CollateralTab
                    collateralBook={collateralBook}
                    netAssetValue={netAssetValue}
                />
            </TabSelector>
        </div>
    );
};
