import type { Meta, StoryObj } from '@storybook/react';
import { StatChart, StatChartProps } from '@perses-dev/components';

const meta: Meta<typeof StatChart> = {
  component: StatChart,
  args: {
    width: 515,
    height: 227,
    data: {
      calculatedValue: 7.57037037037037,
      seriesData: {
        name: 'prometheus_http_requests_total{code="302",handler="/",instance="demo.do.prometheus.io:9090",job="prometheus"}',
        values: [
          [1677338340000, 28],
          [1677338370000, 28],
          [1677338400000, 28],
          [1677338430000, 28],
          [1677338460000, 28],
          [1677338490000, 28],
          [1677338520000, 28],
          [1677338550000, 28],
          [1677338580000, 28],
          [1677338610000, 28],
          [1677338640000, 28],
          [1677338670000, 28],
          [1677338700000, 28],
          [1677338730000, 28],
          [1677338760000, 28],
          [1677338790000, 28],
          [1677338820000, 28],
          [1677338850000, 28],
          [1677338880000, 28],
          [1677338910000, 28],
          [1677338940000, 28],
          [1677338970000, 28],
          [1677339000000, 28],
          [1677339030000, 28],
          [1677339060000, 28],
          [1677339090000, 28],
          [1677339120000, 28],
          [1677339150000, 28],
          [1677339180000, 28],
          [1677339210000, 28],
          [1677339240000, 28],
          [1677339270000, 28],
          [1677339300000, 28],
          [1677339330000, 28],
          [1677339360000, 28],
          [1677339390000, 28],
          [1677339420000, 28],
          [1677339450000, 28],
          [1677339480000, 28],
          [1677339510000, 28],
          [1677339540000, 28],
          [1677339570000, 28],
          [1677339600000, 28],
          [1677339630000, 28],
          [1677339660000, 28],
          [1677339690000, 28],
          [1677339720000, 28],
          [1677339750000, 28],
          [1677339780000, 28],
          [1677339810000, 28],
          [1677339840000, 28],
          [1677339870000, 28],
          [1677339900000, 28],
          [1677339930000, 28],
          [1677339960000, 28],
          [1677339990000, 28],
          [1677340020000, 28],
          [1677340050000, 28],
          [1677340080000, 28],
          [1677340110000, 28],
          [1677340140000, 28],
          [1677340170000, 28],
          [1677340200000, 28],
          [1677340230000, 28],
          [1677340260000, 28],
          [1677340290000, 28],
          [1677340320000, 28],
          [1677340350000, 28],
          [1677340380000, 28],
          [1677340410000, 28],
          [1677340440000, 28],
          [1677340470000, 28],
          [1677340500000, 28],
          [1677340530000, 28],
          [1677340560000, 28],
          [1677340590000, 28],
          [1677340620000, 28],
          [1677340650000, 28],
          [1677340680000, 28],
          [1677340710000, 28],
          [1677345210000, 1],
          [1677345240000, 1],
          [1677345270000, 1],
          [1677345300000, 1],
          [1677345330000, 1],
          [1677345360000, 1],
          [1677345390000, 1],
          [1677345420000, 1],
          [1677345450000, 1],
          [1677345480000, 1],
          [1677345510000, 1],
          [1677345540000, 1],
          [1677345570000, 1],
          [1677345600000, 1],
          [1677345630000, 1],
          [1677350670000, 1],
          [1677350700000, 1],
          [1677350730000, 1],
          [1677350760000, 1],
          [1677350790000, 1],
          [1677350820000, 1],
          [1677350850000, 1],
          [1677350880000, 1],
          [1677350910000, 1],
          [1677350940000, 1],
          [1677350970000, 1],
          [1677351000000, 1],
          [1677351030000, 1],
          [1677351060000, 1],
          [1677351090000, 1],
          [1677351120000, 1],
          [1677351150000, 1],
          [1677351180000, 1],
          [1677351210000, 1],
          [1677351240000, 1],
          [1677351270000, 1],
          [1677351300000, 1],
          [1677351330000, 1],
          [1677351360000, 1],
          [1677351390000, 1],
          [1677351420000, 1],
          [1677351450000, 1],
          [1677351480000, 1],
          [1677351510000, 1],
          [1677351540000, 1],
          [1677351570000, 1],
          [1677351600000, 1],
          [1677351630000, 1],
          [1677351660000, 1],
          [1677351690000, 1],
          [1677351720000, 1],
          [1677351750000, 1],
          [1677351780000, 1],
          [1677351810000, 1],
          [1677351840000, 1],
          [1677351870000, 1],
          [1677351900000, 1],
          [1677351930000, 1],
          [1677351960000, 1],
          [1677351990000, 1],
          [1677352020000, 1],
          [1677352050000, 1],
          [1677352080000, 1],
          [1677352110000, 1],
          [1677352140000, 1],
          [1677352170000, 1],
          [1677352200000, 1],
          [1677352230000, 1],
          [1677352260000, 1],
          [1677352290000, 1],
          [1677352320000, 1],
          [1677352350000, 1],
          [1677352380000, 1],
          [1677352410000, 1],
          [1677352440000, 1],
          [1677352470000, 1],
          [1677352500000, 1],
          [1677352530000, 2],
          [1677352560000, 2],
          [1677352590000, 2],
          [1677352620000, 2],
          [1677352650000, 2],
          [1677352680000, 2],
          [1677352710000, 2],
          [1677352740000, 2],
          [1677352770000, 2],
          [1677352800000, 2],
          [1677352830000, 2],
          [1677352860000, 2],
          [1677352890000, 2],
          [1677352920000, 2],
          [1677352950000, 2],
          [1677352980000, 2],
          [1677353010000, 2],
          [1677353040000, 2],
          [1677353070000, 2],
          [1677353100000, 2],
          [1677353130000, 2],
          [1677353160000, 2],
          [1677353190000, 2],
          [1677353220000, 2],
          [1677353250000, 2],
          [1677353280000, 2],
          [1677353310000, 2],
          [1677353340000, 2],
          [1677353370000, 2],
          [1677353400000, 2],
          [1677353430000, 2],
          [1677353460000, 2],
          [1677353490000, 2],
          [1677353520000, 2],
          [1677353550000, 2],
          [1677353580000, 2],
          [1677353610000, 2],
          [1677353640000, 2],
          [1677353670000, 2],
          [1677353700000, 2],
          [1677353730000, 2],
          [1677353760000, 2],
          [1677353790000, 2],
          [1677353820000, 2],
          [1677353850000, 2],
          [1677353880000, 2],
          [1677353910000, 2],
          [1677353940000, 2],
          [1677353970000, 2],
          [1677354000000, 2],
          [1677354030000, 2],
          [1677354060000, 2],
          [1677354090000, 2],
          [1677354120000, 2],
          [1677354150000, 2],
          [1677354180000, 2],
          [1677354210000, 2],
          [1677354240000, 2],
          [1677354270000, 2],
          [1677354300000, 2],
          [1677354330000, 2],
          [1677354360000, 2],
          [1677354390000, 2],
          [1677354420000, 3],
          [1677354450000, 3],
          [1677354480000, 3],
          [1677354510000, 3],
          [1677354540000, 3],
          [1677354570000, 3],
          [1677354600000, 3],
          [1677354630000, 3],
          [1677354660000, 3],
          [1677354690000, 3],
          [1677354720000, 3],
          [1677354750000, 3],
          [1677354780000, 3],
          [1677354810000, 3],
          [1677354840000, 3],
          [1677354870000, 3],
          [1677354900000, 3],
          [1677354930000, 3],
          [1677354960000, 3],
          [1677354990000, 3],
          [1677355020000, 3],
          [1677355050000, 3],
          [1677355080000, 3],
          [1677355110000, 3],
          [1677355140000, 3],
          [1677355170000, 3],
          [1677355200000, 3],
          [1677355230000, 3],
          [1677355260000, 3],
          [1677355290000, 3],
          [1677355320000, 3],
          [1677355350000, 3],
          [1677355380000, 3],
          [1677355410000, 3],
          [1677355440000, 3],
          [1677355470000, 3],
          [1677355500000, 3],
          [1677355530000, 3],
          [1677355560000, 3],
          [1677355590000, 3],
          [1677355620000, 3],
          [1677355650000, 3],
          [1677355680000, 3],
          [1677355710000, 3],
          [1677355740000, 3],
          [1677355770000, 3],
          [1677355800000, 3],
          [1677355830000, 3],
          [1677355860000, 3],
          [1677355890000, 3],
          [1677355920000, 3],
          [1677355950000, 3],
          [1677355980000, 3],
          [1677356010000, 3],
          [1677356040000, 3],
          [1677356070000, 3],
          [1677356100000, 3],
          [1677356130000, 3],
          [1677356160000, 3],
          [1677356190000, 3],
          [1677356220000, 3],
          [1677356250000, 3],
          [1677356280000, 3],
          [1677356310000, 3],
          [1677356340000, 3],
          [1677356370000, 3],
          [1677356400000, 3],
          [1677356430000, 3],
          [1677356460000, 3],
          [1677356490000, 3],
          [1677356520000, 3],
          [1677356550000, 3],
          [1677356580000, 3],
          [1677356610000, 3],
          [1677356640000, 3],
          [1677356670000, 3],
          [1677356700000, 3],
          [1677356730000, 3],
          [1677356760000, 3],
          [1677356790000, 3],
          [1677356820000, 3],
          [1677356850000, 3],
          [1677356880000, 3],
          [1677356910000, 3],
          [1677356940000, 3],
          [1677356970000, 3],
          [1677357000000, 3],
          [1677357030000, 3],
          [1677357060000, 3],
          [1677357090000, 3],
          [1677357120000, 3],
          [1677357150000, 3],
          [1677357180000, 3],
          [1677357210000, 3],
          [1677357240000, 3],
          [1677357270000, 3],
          [1677357300000, 3],
          [1677357330000, 3],
          [1677357360000, 3],
          [1677357390000, 3],
          [1677357420000, 3],
          [1677357450000, 3],
          [1677357480000, 3],
          [1677357510000, 3],
          [1677357540000, 3],
          [1677357570000, 3],
          [1677357600000, 3],
          [1677357630000, 3],
          [1677357660000, 3],
          [1677357690000, 3],
          [1677357720000, 3],
          [1677357750000, 3],
          [1677357780000, 3],
          [1677357810000, 3],
          [1677357840000, 3],
          [1677357870000, 3],
          [1677357900000, 3],
          [1677357930000, 4],
          [1677357960000, 4],
          [1677357990000, 4],
          [1677358020000, 4],
          [1677358050000, 4],
          [1677358080000, 4],
          [1677358110000, 4],
          [1677358140000, 4],
          [1677358170000, 4],
          [1677358200000, 4],
          [1677358230000, 4],
          [1677358260000, 4],
          [1677358290000, 4],
          [1677358320000, 4],
          [1677358350000, 4],
          [1677358380000, 4],
          [1677358410000, 4],
          [1677358440000, 4],
          [1677358470000, 4],
          [1677358500000, 4],
          [1677358530000, 4],
          [1677358560000, 4],
          [1677358590000, 4],
          [1677358620000, 4],
          [1677358650000, 4],
          [1677358680000, 4],
          [1677358710000, 4],
          [1677358740000, 4],
          [1677358770000, 4],
          [1677358800000, 4],
          [1677358830000, 4],
          [1677358860000, 4],
          [1677358890000, 4],
          [1677358920000, 4],
          [1677358950000, 4],
          [1677358980000, 4],
          [1677359010000, 4],
          [1677359040000, 4],
          [1677359070000, 4],
          [1677359100000, 4],
          [1677359130000, 4],
          [1677359160000, 4],
          [1677359190000, 4],
          [1677359220000, 4],
          [1677359250000, 4],
          [1677359280000, 4],
          [1677359310000, 4],
          [1677359340000, 4],
          [1677359370000, 4],
          [1677359400000, 4],
          [1677359430000, 4],
          [1677359460000, 4],
          [1677359490000, 4],
          [1677359520000, 4],
          [1677359550000, 4],
          [1677359580000, 4],
          [1677359610000, 4],
          [1677359640000, 4],
          [1677359670000, 4],
          [1677359700000, 4],
          [1677359730000, 4],
          [1677359760000, 4],
          [1677359790000, 4],
          [1677359820000, 4],
          [1677359850000, 4],
          [1677359880000, 4],
          [1677359910000, 4],
          [1677359940000, 4],
        ],
      },
    },
    unit: { abbreviate: false, kind: 'Decimal' },
    sparkline: { lineStyle: { width: 2, color: '#1976d2', opacity: 1 }, areaStyle: { color: '#1976d2', opacity: 0.4 } },
  },
  render: (args) => <StatChartWrapper {...args} />,
};

export default meta;

type Story = StoryObj<typeof StatChart>;

const StatChartWrapper = (props: StatChartProps) => {
  return (
    <div
      style={{
        height: props.height,
        width: props.width,
      }}
    >
      <StatChart {...props} />
    </div>
  );
};

export const Primary: Story = {
  args: {},
};
