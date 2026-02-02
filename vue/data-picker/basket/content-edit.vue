<template>
	<div :class="$style.wrapper" :style="{ paddingBottom: bottomGap }">
		<div :class="$style.head">
			<div :class="$style.title">
				<T text="_ORDER_DETAILS_"/>
			</div>
			<button
				v-if="$props.stage !== 'upsells' || $props.upsellItemList.length"
				:class="$style.clearBtn"
				type="button"
				@click="reset">
				<T text="_CLEAR_ALL_"/>
			</button>
		</div>
		<div ref="contentRef" :class="$style.content" @scroll="scroll">
			<ul :class="$style.itemList">
				<template v-for="basketItem in $props.itemList" :key="basketItem['idBasketItem']">
					<li :class="[$style.item, { [$style.itemDeletingAnimate]: idItemToDelete === basketItem['idBasketItem'] }]">
						<div :class="$style.itemDetails">
							<div :class="$style.itemLine">
								<p :class="$style.itemTitle">
									<span v-if="basketItem['mapZoneName']" :class="$style.itemName">
										{{ basketItem['name'] }}, {{ basketItem['mapZoneName'] }}
									</span>
									<span v-else :class="$style.itemName">{{ basketItem['name'] }}</span>
								</p>
							</div>
							<div :class="[$style.itemLine,
								{
									[$style.itemLineSmallGap]:(basketItem['admitCount'] > 1)&& !seats[basketItem['idBasketItem']]
								}]"
							>
								<div v-if="seats[basketItem['idBasketItem']]" :class="$style.seats">
									<template v-for="(place, row) in (seats[basketItem['idBasketItem']] || {})">
										<div :class="$style.seatInfo">
											<p :class="$style.seatInfoItem">
												<span :class="$style.seatInfoLabel"><T text="_ROW_"/>:</span>
												<span :class="$style.seatInfoValue">{{ row }}</span>
											</p>
											<p :class="$style.seatInfoItem">
												<span :class="$style.seatInfoLabel"><T
													text="_TICKET_SEAT_"/>:
												</span>
												<span :class="$style.seatInfoValue">
													{{ place }}
												</span>
											</p>
										</div>
									</template>
									<template v-if="basketItem['admitCount'] > 1 && !seats[basketItem['idBasketItem']]">
										<div :class="$style.seatInfo">
											<span :class="$style.itemCount">
												{{ basketItem['admitCount'] }}
												<T text="_TICKETS_"/>
											</span>
										</div>
									</template>
								</div>
								<div :class="$style.priceBlock">
									<template v-if="basketItem['discount']">
										<div :class="$style.priceGroup">
											<p :class="$style.crossedPrice">{{ basketItem['basePrice'] }}</p>
											<p :class="$style.itemPrice">{{ basketItem.price }}</p>
										</div>
										<p :class="$style.discount">{{ format(basketItem['discount'])}}</p>
									</template>
									<template v-else>
										<p :class="$style.itemPrice">{{ basketItem.price }}</p>
									</template>
								</div>
							</div>
							<template v-if="basketItem['isResale']">
								<ResalePopover size="sm" @open="onResalePopoverOpen"/>
							</template>
						</div>
						<button
							v-if="$props.stage !== 'upsells'"
							:class="$style.deleteBtn"
							@click="deleteItem(basketItem['idBasketItem'])"
						>
							<SvgIcon icon="24-kit-basket"/>
						</button>
					</li>
				</template>
				<template v-for="upsellItem in $props.upsellItemList" :key="upsellItem['idBasketItem']">
					<li :class="[$style.item, { [$style.itemDeletingAnimate]: idItemToDelete === upsellItem['idBasketItem'] }]">
						<div :class="$style.itemDetails">
							<div :class="$style.itemLine">
								<p :class="$style.itemTitle">
									<span :class="$style.itemName">{{ upsellItem['name'] }}</span>
								</p>
							</div>
							<div :class="$style.itemLine">
								<p :class="$style.itemPrice">{{ upsellItem.price }}</p>
								<template
									v-if="upsellItem['upsellAttr'] && Object.keys(upsellItem['upsellAttr']).length"
								>
									<div :class="$style.attrInfo">
										<template v-for="(value, key, index) in upsellItem['upsellAttr']" :key="key">
											<span :class="$style.attrLabel">
												{{ key }}: {{ value }}
												<span
													v-if="index < Object.entries(upsellItem['upsellAttr']).length - 1">,</span>
											</span>
										</template>
									</div>
								</template>
							</div>
						</div>
						<button
							:class="$style.deleteBtn"
							@click="deleteUpsellItem(upsellItem['idBasketItem'])"
						>
							<SvgIcon icon="24-kit-basket"/>
						</button>
					</li>
				</template>
			</ul>
		</div>
		<div v-if="$props.blocked" :class="$style.overlay"></div>
	</div>
</template>

<script setup>

import { ref, computed, onMounted, nextTick } from 'vue';
import T from '@vue/t';
import SvgIcon from '@vue/svg-icon';
import ResalePopover from '@vue/resale/popover';
import GTM from 'google-tag-manager';
import { useFormat } from '@vue/discount/useFormat';

const props = defineProps([
	'bottomGap',
	'itemList',
	'upsellItemList',
	'blocked',
	'stage',
	'GTM',
]);

const emit = defineEmits([
	'deleteItem',
	'deleteUpsellItem',
	'reset',
	'scroll',
	'scrollable'
]);

const idItemToDelete = ref(null);
const bottomGap = computed(() => `${props.bottomGap}px`);
const contentRef = ref(null);
const seats = computed(() => {
	let seats = {};
	props.itemList.forEach(item => {
		if (item.hasOwnProperty('seats')) {
			seats[item.idBasketItem] = {};
			item.seats.forEach(seat => {
				if (!seats[item.idBasketItem].hasOwnProperty(seat.row)) {
					seats[item.idBasketItem][seat.row] = seat.place;
				} else {
					seats[item.idBasketItem][seat.row] = seats[item.idBasketItem][seat.row] + ', ' + seat.place;
				}
			});
		}
	});
	return seats;
});

const { format } = useFormat();

const reset = () => emit('reset', props.stage);
const scroll = () => emit('scroll');
const deleteItem = idBasketItem => {
	idItemToDelete.value = idBasketItem;
	emit('deleteItem', idBasketItem);
};
const deleteUpsellItem = idBasketItem => {
	if (Number(idItemToDelete.value) === Number(idBasketItem)) {
		return;
	}
	idItemToDelete.value = idBasketItem;
	emit('deleteUpsellItem', idBasketItem);
};
const onResalePopoverOpen = () => {
	if (props.GTM.hintResaleShown) {
		GTM.pushGA4EventsCustomToDataLayer(props.GTM.hintResaleShown);
	}
};

onMounted(() => {
	nextTick(() => {
		if (contentRef.value.scrollHeight > contentRef.value.clientHeight) {
			emit('scrollable');
		}
	});
});
</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';
@import 'public/scss/globals/mixins';

.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	max-height: 90vh;
	box-sizing: border-box;
	background: var(--Bg-default);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 3px 10px 0 rgba(0, 0, 0, 0.04), 0 7px 24px 0 rgba(0, 0, 0, 0.05), 0 24px 80px 0 rgba(0, 0, 0, 0.07);
	overflow: hidden;
	@media (min-width: $media-sm) {
		width: 450px;
		border-radius: 24px;
	}
}

.head {
	display: flex;
	flex-wrap: nowrap;
	flex-direction: row;
	justify-content: space-between;
	padding: 20px 24px;
	font-size: 16px;
	background: var(--Bg-ghost);
	line-height: 1;

	@media (min-width: $media-sm) {
		&:before {
			display: none;
		}
	}
}

.title {
	flex-grow: 2;
	color: var(--Content-primary);
	font-weight: 600;
	font-size: 16px;
	line-height: 20px;
}

.clearBtn {
	color: var(--Interaction-Secondary-content);
	font-weight: 400;
	transition: 200ms;

	&:hover {
		color: var(--Accent-alert);
	}
}

.content {
	padding: 16px 20px;
	overflow: hidden;
	overflow-y: scroll;
	box-sizing: border-box;
	transition: 0.3s;
	@include vertical-scrollbar();

	&::-webkit-scrollbar-track {
		margin-bottom: 20px;
	}

	:global(.is_ltr) & {
		padding-right: 16px;
		margin-right: 2px;
	}

	:global(.is_rtl) & {
		padding-left: 16px;
		margin-left: 2px;
	}

	@media (min-width: $media-xxxs) {
		padding: 20px 20px;
	}

	@media (min-width: $media-sm) {
		max-height: 60vh;
		padding: 16px 24px 24px 24px;

		:global(.is_ltr) & {
			padding-right: 20px;
			margin-right: 2px;
		}

		:global(.is_rtl) & {
			padding-left: 20px;
			margin-left: 2px;
		}
	}
}

.itemList {
	display: flex;
	flex-direction: column;
	gap: 4px;
	@media (min-width: $media-sm) {
		gap: 8px;
	}
}

.item {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	border: 1px solid var(--Bg-border);
	border-radius: 8px;
	transition: 200ms;
	box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0);

	&:hover {
		box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
		:global(.icon) {
			fill:  var(--Accent-alert);
		}
	}
}

.itemDeletingAnimate {
	opacity: 0;

	:global(.is_ltr) & {
		@keyframes v-basket-dropdown-deleting-ltr {
			0% {
				transform: translateX(0);
				opacity: 1;
			}
			100% {
				transform: translateX(-50px);
				opacity: 0;
			}
		}
		animation: 200ms ease-out v-basket-dropdown-deleting-ltr;
	}

	:global(.is_rtl) & {
		@keyframes v-basket-dropdown-deleting-rtl {
			0% {
				transform: translateX(0);
				opacity: 1;
			}
			100% {
				transform: translateX(50px);
				opacity: 0;
			}
		}
		animation: 200ms ease-out v-basket-dropdown-deleting-rtl;
	}
}

.itemCount {
	position: relative;
	top: 1px;
	color: var(--Content-secondary);
	font-size: 14px;
}

.itemDetails {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 16px 12px;
	overflow: hidden;
	@media (min-width: $media-xxxs) {
		padding: 16px;
	}
}

.deleteBtn {
	padding: 16px 12px;
	flex: 0 0 auto;
	font-size: 0;
	@media (min-width: $media-xxxs) {
		padding: 16px;
	}

	:global(.icon) {
		width: 24px;
		height: 24px;
		fill: var(--Content-secondary);
		transition: 200ms;
	}

	:global(.is_ltr) & {
		border-left: 1px dashed var(--Bg-border);
	}

	:global(.is_rtl) & {
		border-right: 1px dashed var(--Bg-border);
	}
}

.itemLine {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	gap: 4px;
}

.itemLineSmallGap {
	column-gap: 8px;
}

.itemTitle {
	font-size: 14px;
	overflow-wrap: break-word;
	color: var(--Content-primary);
	font-weight: 400;
	line-height: 17px;
	@media (min-width: $media-xxxs) {
		font-size: 16px;
		line-height: 19px;
	}
}

.itemName {
	font-size: 16px;;
	font-weight: 600;
	line-height: 20px;
}

.seatInfo {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 4px;
}

.itemPrice {
	display: flex;
	align-items: flex-end;
	color:var(--Content-primary);
	font-size: 14px;
	font-weight: 600;
}

.seats {
	display: flex;
	flex-direction: column;
}

.seatInfoItem {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 4px;
	font-size: 14px;
	line-height: 18px;
}

.seatInfoLabel {
	color: var(--Content-secondary);
	font-weight: 400;
}

.seatInfoValue {
	color: var(--Content-primary);
	font-weight: 600;
}

.priceBlock {
	display: flex;
	flex-direction: row;
	gap: 8px;
	align-items: center;
	line-height: 20px;
}

.crossedPrice {
	text-decoration: line-through;
	color: var(--Content-secondary);
	font-weight: 400;
	font-size: 14px;
}

.priceGroup {
	display: flex;
	align-items: center;
	gap: 4px;
}

.discount {
	display: flex;
	color: var(--Interaction-Primary-content);
	background-color: var(--Accent-success);
	border-radius: 4px;
	line-height: 14px;
	padding: 2px 4px;
	font-size: 11px;
	font-style: normal;
	font-weight: 600;
	align-items: center;
	direction: ltr;
}

.attrInfo {
	display: flex;
	flex-direction: row;
	gap: 4px;
}

.attrLabel {
	font-size: 14px;
	font-weight: 400;
	line-height: 18px;
	color: var(--Content-secondary);
	white-space: nowrap;
}

.overlay {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: var(--Bg-default);
	opacity: 0.4;
	z-index: 10000;
	@keyframes v-basket-dropdown-overlay {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 0.4;
		}
	}
	animation: 200ms ease-in v-basket-dropdown-overlay;
}
</style>