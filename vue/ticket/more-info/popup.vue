<template>
	<Popup v-if="isVisible" :open="open" :swipe="true" @close="close">
		<NoMobile>
			<div :class="$style.contentTopHidden"></div>
		</NoMobile>
		<div :class="$style.moreInfo">
			<Mobile>
				<div :class="$style.head">
					<div :class="$style.headTitle">
						<T text="_MORE_DETAILS_"/>
					</div>
					<button :class="$style.headClose" type="button" @click="close">
						<SvgIcon icon="24-kit-cross"/>
					</button>
				</div>
			</Mobile>
			<div :class="$style.content">
				<div :class="$style.contentTop">
					{{ name }}
				</div>
				<GalleryContent
					:galleryImageList="galleryImageList"
					:imageIndex="currentImageIndex"
					@openGallery="openGallery"
				/>
				<div :class="[$style.description, 'mce-wrapper-content']" v-html="description"></div>
			</div>
			<div :class="$style.contentBottom">
				<NoMobile>
					<button :class="$style.contentBottomBtn"
							type="button"
							@click="close"
					>
						<T text="_CLOSE_"/>
					</button>
				</NoMobile>
			</div>
		</div>
	</Popup>
	<GalleryFullImage
		:open="isGalleryOpen"
		:galleryImageList="galleryImageList"
		:imageIndex="currentImageIndex"
		@close="closeGallery"
		@setImageIndex="setImageIndex"
	/>
</template>

<script setup>

import { ref, defineProps, defineEmits} from 'vue';
import T from '@vue/t';
import Popup from '@vue/popup';
import Mobile from '@vue/mobile';
import NoMobile from '@vue/no-mobile';
import GalleryContent from '@vue/ticket-office/casual/components/gallery/content';
import GalleryFullImage from '@vue/ticket-office/casual/components/gallery/full';
import SvgIcon from '@vue/svg-icon';

const ANIMATION_DURATION_GALLERY_CLOSE = 300;

const props = defineProps([
	'open',
	'name',
	'description',
	'galleryImageList'
]);

const emit = defineEmits([
	'close'
]);

const isVisible = ref(true);
const isGalleryOpen = ref(false);
const currentImageIndex = ref(0);

const openGallery = (index) => {
	setImageIndex(index);
	isGalleryOpen.value = true;
	isVisible.value = false;
};

const closeGallery = () => {
	isVisible.value = true;
	setTimeout(() => isGalleryOpen.value = false, ANIMATION_DURATION_GALLERY_CLOSE);
};

const close = () => {
	emit('close');
	setImageIndex(0);
};

const setImageIndex = (index) => {
	currentImageIndex.value = index;
};

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';
@import 'public/scss/globals/mixins';

.moreInfo {
	display: flex;
	flex-direction: column;
	max-height: 80vh;
}

.head {
	display: flex;
	justify-content: space-between;
	background-color: var(--Bg-default);
	padding: 24px 20px 12px;
	font-size: 16px;
	line-height: 24px;
}

.headTitle {
	color: var(--Content-primary);
	font-size: 16px;
	font-style: normal;
	font-weight: 500;
	@media (min-width: $media-sm) {
		font-weight: 700;
		font-size: 28px;
		line-height: 32px;
	}
}

.headClose {
	:global(.icon) {
		display: block;
		width: 24px;
		height: 24px;
		fill:var(--Interaction-Secondary-content);
	}

	&:hover {
		:global(.icon) {
			fill:var(--Interaction-Secondary-content_hover);
		}
	}
}

.content {
	padding: 16px 24px 0 24px;
	background-color: var(--Bg-default);
	display: flex;
	flex-direction: column;
	gap: 12px;
	box-sizing: border-box;
	max-height: 614px;
	overflow-y: auto;

	@include vertical-scrollbar();

	@media (min-width: $media-sm) {
		width: 480px;
		max-height: 744px;
		gap: 24px;
		padding: 12px 32px 0 32px;
	}
}

.description {
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: 18px;
	word-break: break-word;
	@media(min-width: $media-sm) {
		font-size: 16px;
		line-height: 20px;
	}

	@keyframes description-fade-in-down {
		from {
			opacity: 0;
			transform: translateY(25%);
		}
		to {
			opacity: 1;
			transform: translateY(0%);
		}
	}
	animation: description-fade-in-down 0.5s;

	ul, ul li {
		margin: 0;
	}

	ul {
		:global(.is_ltr) & {
			padding: 0 0 0 28px;
		}

		:global(.is_rtl) & {
			padding: 0 28px 0 0;
		}
	}
}

.contentTop {
	color: var(--Content-primary);
	font-weight: 700;
	font-size: 28px;
	line-height: 32px;
}

.contentTopHidden {
	position: relative;
	top: 0;
	height: 60px;
	background: var(--Bg-default);
}

.contentBottom {
	position: relative;
	bottom: 0;
	background: var(--Bg-default);
	padding: 10px 24px 10px 24px;
	@media (min-width: $media-sm) {
		padding: 28px 32px 32px;
	}
}

.contentBottomBtn {
	display: flex;
	justify-content: center;
	width: 100%;
	color: var(--Interaction-Secondary-content);
	border-radius: 8px;
	padding: 16px 20px;
	border: 1px solid var(--Interaction-Secondary-border);
	box-sizing: border-box;
	transition: all .2s;
	font-size: 18px;
	font-weight: 500;
	line-height: 24px;

	&:hover {
		border: 1px solid var(--Interaction-Secondary-border_hover);
		cursor: pointer;
		color: var(--Interaction-Secondary-border_hover);
	}
}

</style>