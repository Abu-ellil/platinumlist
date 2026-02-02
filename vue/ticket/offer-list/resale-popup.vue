<template>
	<Popup :open="$props.open" @close="close">
		<div :class="$style.popup">
			<div :class="$style.title">
				<T text="_BEST_AVAILABLE_OFFERS_" />
			</div>
			<div :class="$style.subtitle">
				{{ $props.offer['sectionName'] }}
			</div>
			<div :class="$style.offer">
				<div :class="$style.info">
					<div :class="$style.name">
						{{ $props.offer['name'] }}
					</div>
					<div :class="$style.prices">
						<template v-if="minPrice === maxPrice">
							{{ minPrice }} {{ currency }}
						</template>
						<template v-else>
							{{ minPrice }}–{{ maxPrice }} {{ currency }}
						</template>
					</div>
					<div :class="$style.ages">
						{{ $props.offer['ageLimit'] }}
					</div>
					<div :class="$style.resalePopover">
						<ResalePopover @open="onResalePopoverOpen"/>
					</div>
				</div>
				<div :class="$style.counter">
					<Counter
						:selected="selected"
						:max="$props.offer['maxPerOrder']"
						:min="$props.offer['minPerOrder']"
						:disabled="isControlBlocked"
						size="sm"
						@change="change"
					/>
				</div>
			</div>
			<div :class="$style.footer">
				<button :class="$style.done" class="btn btn--blue" @click="close">
					<T text="_DONE_" />
				</button>
				<p :class="$style.total">
					{{ total }} {{ currency }}
				</p>
			</div>
		</div>
	</Popup>
</template>

<script setup>

import App from 'app';
import { ref, computed, defineProps, defineEmits } from 'vue';
import T from '@vue/t';
import Popup from '@vue/popup';
import Counter from '@vue/counter';
import ResalePopover from '@vue/resale/popover';
import { useBlocked } from '@vue/composable/useBlocked';
import { useOffer } from '@vue/ticket-office/casual/composable/useOffer';
import { useBasket } from '@vue/ticket-office/casual/composable/useBasket';
import { useCurrency } from '@vue/ticket-office/casual/composable/useCurrency';
import { useGTM } from '@vue/ticket-office/casual/composable/useGTM';

const DEBOUNCE_RESALE_KEY = 'DEBOUNCE:RESALE_CONTROL';
const DEBOUNCE_RESALE_DELAY = 1000;

const props = defineProps([
	'open',
	'offer',
]);

const emit = defineEmits([
	'close'
]);

const {
	minPrice,
	maxPrice
} = useOffer(computed(() => props.offer));
const basket = useBasket();
const currency = useCurrency();
const { block, unblock, isBlocked } = useBlocked();
const { pushGA4EventsCustomToDataLayer } = useGTM();
const isChanging = ref(false);
const selectedCount = ref(basket.getResaleCountInBasket(props.offer['idEventOffer']));
const isControlBlocked = computed(() => !isChanging.value && isBlocked('CASUAL_TICKET_OFFICE:SELECTION_BLOCK'));
const total = computed(() => App.currency(basket.getResaleSumInBasket(props.offer['idEventOffer'])));
const selected = computed(() => isChanging.value
	? selectedCount.value
	: basket.getResaleCountInBasket(props.offer['idEventOffer'])
);

const change = count => {
	isChanging.value = true;
	selectedCount.value = count;
	block('CASUAL_TICKET_OFFICE:SELECTION_BLOCK');
	App.debounce(
		() => {
			basket.updateResaleCount(props.offer['idEventOffer'], count).finally(() => {
				selectedCount.value = basket.getResaleCountInBasket(props.offer['idEventOffer']);
				isChanging.value = false;
				unblock('CASUAL_TICKET_OFFICE:SELECTION_BLOCK');
			});
		},
		DEBOUNCE_RESALE_KEY,
		DEBOUNCE_RESALE_DELAY
	);
};

const close = () => emit('close');

const onResalePopoverOpen = () => {
	pushGA4EventsCustomToDataLayer('hintResaleShown');
}

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.popup {
	padding: 32px;
	background: var(--Bg-default);
}

.title {
	margin-bottom: 16px;
	font-size: 20px;
	font-weight: 600;
	line-height: 24px;
}

.subtitle {
	font-size: 16px;
	font-weight: 400;
	margin-bottom: 16px;
}

.offer {
	width: 100%;
	margin-bottom: 32px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 16px;
	padding: 16px;
	border-radius: 12px;
	border: 1px solid var(--Interaction-Disabled-border, #DBDBDB);
	box-sizing: border-box;
	background: var(--Bg-default);
	@media (min-width: $media-sm) {
		width: 404px;
	}
}

.info {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

.name {
	width: 100%;
	font-size: 16px;
	font-weight: 400;
	line-height: 18px;
}

.prices {
	font-size: 14px;
	font-weight: 600;
	line-height: 18px;
}

.ages {
	color: var(--Content-secondary);
	font-size: 14px;
	font-weight: 400;
	line-height: 18px;
}

.resalePopover {
	width: 100%;
	flex: 1 0 auto;
	margin-top: 4px;
}

.footer {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: 32px;
}

.done {
	padding: 11px;
	flex: 1 0 auto;
	font-size: 16px;
	font-weight: 400;
	line-height: 24px;
}

.total {
	flex: 0 0 auto;
	min-width: 100px;
	font-size: 18px;
	font-weight: 400;
	line-height: 24px;

	:global(.is_ltr) & {
		text-align: right;
	}

	:global(.is_rtl) & {
		text-align: left;
	}
}

</style>