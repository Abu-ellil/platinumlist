<template xmlns="http://www.w3.org/1999/html">
	<HidingAnimation>
		<div v-if="!isHidden">
			<div v-if="hasToggle" :class="$style.head">
				<div :class="$style.sectionRow" @click="toggle">
					<span :class="$style.name">{{ name }}</span>
					<div :class="$style.info">
						<T
							v-if="hasInfoText"
							text="_OFFERS_FROM_"
							:replacements="{
								'{{{count}}}': countOffers,
								'{{{price}}}': `${minPrice} ${currency}`
							}"
						/>
						<MoreInfoControl
							v-if="description"
							:name="name"
							:description="description"
							:galleryImageList="galleryImageList"
						>
							<span :class="$style.customButton">
								<span v-if="iconImages.length" :class="$style.imageContainer">
									<img
										v-for="(image, index) in iconImages"
										:class="{
											[$style.image]: true,
											[$style.lastImage] : index === iconImages.length - 1 && iconImages.length > 1
										}"
										:src="image.thumb"
										alt="Thumb image"
									>
								</span>
								<T :text="moreInfoTitle || '_MORE_DETAILS_'"/>
							</span>
							</MoreInfoControl>
					</div>
				</div>
				<button @click="toggle">
					<span :class="[$style.arrow, { [$style.arrowOpen]: isOpen }]" >
						<SvgIcon icon="arrowhead-b-up" />
					</span>
				</button>
			</div>
			<div :class="$style.content" :style="{ height }">
				<div ref="contentInnerRef" :class="[$style.contentInner, { [$style.contentInnerTop]: hasToggle }]">
					<slot></slot>
				</div>
			</div>
		</div>
	</HidingAnimation>
</template>

<script setup>

import { ref, computed, defineProps, onMounted } from 'vue';
import { useCurrency } from '@vue/ticket-office/casual/composable/useCurrency';
import SvgIcon from '@vue/svg-icon';
import MoreInfoControl from '@vue/ticket-office/casual/components/more-info/control';
import HidingAnimation from '@vue/hiding-animation';
import T from '@vue/t';

const props = defineProps([
	'name',
	'description',
	'hasToggle',
	'isHidden',
	'isFolded',
	'galleryImageList',
	'groupList',
	'moreInfoTitle',
	'price',
	'offerCount'
]);

const currency = useCurrency();
const height = ref('auto');
const contentInnerRef = ref(null);
const isOpen = computed(() => height.value !== '0');
const minPrice = computed(() => props.price);
const countOffers = computed(() => props.offerCount);
const hasInfoText = computed(() => !isOpen.value && countOffers.value && (minPrice.value !== null))
const iconImages = computed(() => props.galleryImageList.slice(0, 2));
const getInnerHeight = () => `${contentInnerRef.value.offsetHeight}px`;
const toggle = () => {
	if (height.value === '0') {
		height.value = getInnerHeight();
		setTimeout(() => height.value = 'auto', 300);
	} else {
		height.value = getInnerHeight();
		setTimeout(() => height.value = '0', 0);
	}
};

onMounted(() => {
	height.value = props.isFolded ? '0' : 'auto';
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables.scss';

.head {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
}

.sectionRow {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	gap: 5px;
	cursor: pointer;
}

.info {
	display: flex;
	align-items: center;
	gap: 8px;
	color: var(--Content-secondary);
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	line-height: 16px;
	@media (min-width: $media-sm) {
		color: var(--Content-primary);
	}
}

.name {
	display: flex;
	flex-direction: row;
	width: 100%;
	font-size: 14px;
	font-style: normal;
	font-weight: 700;
	line-height: 18px;
	color: var(--Content-primary);
	@media (min-width: $media-sm) {
		font-size: 16px;
		line-height: 20px;
	}

	:global(.is_ltr) & {
		text-align: left;
	}

	:global(.is_rtl) & {
		text-align: right;
	}
}

.arrow {
	z-index: -1;

	:global(.icon) {
		width: 12px;
		height: 12px;
		fill: var(--Interaction-Secondary-content);
		stroke: var(--Interaction-Secondary-content);
		transform: rotate(180deg);
	}
}

.arrowOpen {
	:global(.icon) {
		transform: rotate(0);
	}
}

.content {
	overflow: hidden;
	transition: 0.3s;
	box-sizing: border-box;
}

.contentInner {
	display: flex;
	flex-direction: column;
	gap: 8px;
	@media (min-width: $media-sm) {
		gap: 16px;
	}
}

.contentInnerTop {
	margin-top: 12px;
}

.imageContainer {
	img {
		height: 18px;
		width: 18px;
		border-radius: 7px;
		border: 1px solid var(--Bg-default);
		background: lightgray 50% / cover no-repeat;
		object-fit: cover;
	}

	.lastImage {
		:global(.is_ltr) & {
			margin-left: -6px;
		}

		:global(.is_rtl) & {
			margin-right: -6px;
		}
	}

	:global(.is_rtl) & {
		margin-right: -4px;
	}

	:global(.is_ltr) & {
		margin-left: -4px;
	}
}

.customButton {
	display: flex;
	border: 1px solid var(--Accent-promo_light);
	border-radius: 8px;
	padding: 0 6px 0 4px;
	gap: 4px;
	align-items: center;
	font-size: 14px;
	line-height: 18px;
}

</style>