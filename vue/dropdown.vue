<template>
	<div ref="toggleRef"
		 :class="$style.toggle"
		 :style="toggleStyle"
	>
		<slot name="toggle"></slot>
	</div>
	<teleport to="body">
		<div v-if="open" :class="$style.overlay" @click="clickOutside"></div>
		<Transition
			:enterActiveClass="$style.enterActive"
			:enterFromClass="$style.enterFrom"
			:leaveActiveClass="$style.leaveActive"
			:leaveToClass="$style.leaveTo"
		>
			<div v-if="open"
				 ref="dropdownRef"
				 :class="{
					[$style.content]: true,
					[$style.contentTop]: verticalAlign === 'top',
					[$style.contentBottom]: verticalAlign === 'bottom',
				}"
				:style="contentStyle"
			>
				<slot name="dropdown"></slot>
			</div>
		</Transition>
	</teleport>
</template>

<script setup>

import App from 'app';
import {
	onMounted,
	onUpdated,
	onBeforeUpdate,
	onBeforeUnmount,
	nextTick,
	reactive,
	ref,
	watch,
	computed,
	defineProps,
	defineEmits
} from 'vue';

const props = defineProps([
	'open',
	'toggleStyle',
	'transitionMs',
	'verticalAlign',
	'horizontalAlign',
]);

const emit = defineEmits([
	'clickOutside'
]);

let transitionMs = computed(() => props.transitionMs || 0),
	position = reactive({ top: 0, left: 0, width: 'auto' }),
	contentStyle = computed(() => ({
		...position,
		transition: `transform ${transitionMs.value}ms, opacity ${transitionMs.value}ms`,
		animationDuration: `${transitionMs.value}ms`
	})),
	verticalAlign = ref(props.verticalAlign),
	toggleRef = ref(null),
	dropdownRef = ref(null),
	toggleStyle = computed(() => (
		props.open
			? { ...props['toggleStyle'], zIndex: 201 }
			: props['toggleStyle']
	)),
	clickOutside = () => emit('clickOutside'),
	positionDropdown = () => {
		nextTick(() => {
			if (!toggleRef.value || !dropdownRef.value) {
				return;
			}

			const bodyRect = document.body.getBoundingClientRect();
			const toggleRect = toggleRef.value.getBoundingClientRect();
			const dropdownRect = dropdownRef.value.getBoundingClientRect();

			const isOverflowRight = () => {
				return Math.round(bodyRect.width - (toggleRect.x + dropdownRect.width)) < 0;
			}

			const isOverflowLeft = () => {
				return Math.round((toggleRect.x + toggleRect.width) - dropdownRect.width) < 0;
			}

			const toLeft = () => {
				position.left = `${Math.round(toggleRect.x)}px`
			};

			const toRight = () => {
				position.left = `${Math.round(toggleRect.x - dropdownRect.width + toggleRect.width)}px`
			};

			const toTop = () => {
				position.top = `${Math.round((toggleRect.top - bodyRect.top) - dropdownRect.height - 8)}px`;
			};

			const toBottom = () => {
				position.top = `${Math.round((toggleRect.top - bodyRect.top) + toggleRect.height + 8)}px`;
			};

			const isBottomArea = () => window.screen.height / 2 < toggleRect.y;

			switch (props.horizontalAlign) {
				case 'left':
					isOverflowRight() ? toRight() : toLeft();
					break;
				case 'right':
					isOverflowLeft() ? toLeft() : toRight();
					break;
				case 'start':
					if (App.isRtl()) {
						isOverflowLeft() ? toLeft() : toRight()
					} else {
						isOverflowRight() ? toRight() : toLeft()
					}
					break;
				case 'end':
					if (App.isRtl()) {
						isOverflowRight() ? toRight() : toLeft()
					} else {
						isOverflowLeft() ? toLeft() : toRight()
					}
					break;
				default:
					if (App.isRtl()) {
						isOverflowLeft() ? toLeft() : toRight();
					} else {
						isOverflowRight() ? toRight() : toLeft()
					}
			}

			switch (props.verticalAlign) {
				case 'top':
					toTop();
					verticalAlign.value = 'top';
					break;

				case 'bottom':
					toBottom();
					verticalAlign.value = 'bottom';
					break;

				case 'auto':
				default:
					if (isBottomArea()) {
						toTop();
						verticalAlign.value = 'top';
					} else {
						toBottom();
						verticalAlign.value = 'bottom';
					}
			}

			position.minWidth = `${Math.round(toggleRect.width)}px`;
		})
	},
	resizeObserver = new ResizeObserver(positionDropdown);

onMounted(() => {
	if (props.open) positionDropdown();
	window.addEventListener('scroll', positionDropdown);
	window.addEventListener('resize', positionDropdown);
});

onUpdated(() => {
	if (props.open) resizeObserver.observe(dropdownRef.value);
});

onBeforeUpdate(() => {
	if (!props.open && dropdownRef.value) {
		resizeObserver.unobserve(dropdownRef.value)
	}
});

onBeforeUnmount(() => {
	if (dropdownRef.value) resizeObserver.unobserve(dropdownRef.value);
	window.removeEventListener('scroll', positionDropdown);
	window.removeEventListener('resize', positionDropdown);
});

watch(() => props.open, open => {
	if (open) positionDropdown();
});

</script>

<style lang="scss" module>

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	opacity: 0;
	z-index: 5001;
}

.toggle {
	display: inline-block;
	position: relative;
}

.content {
	position: absolute;
	z-index: 5002;
	transition: transform 200ms, opacity 200ms;
}

.contentTop {
	@keyframes vue-dropdown-content-top {
		from {
			opacity: 0;
			transform: translateY(-16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	animation: vue-dropdown-content-top 200ms ease-in;

	&.enterFrom {
		transition: 200ms ease-out;
		transform: translateY(-16px);
		opacity: 0;
	}

	&.enterActive {
		transform: translateY(0);
		opacity: 1;
	}

	&.leaveActive {
		transform: translateY(0);
		opacity: 1;
	}

	&.leaveTo {
		transition: 200ms ease-in;
		transform: translateY(-16px);
		opacity: 0;
	}
}

.contentBottom {
	@keyframes vue-dropdown-content-bottom {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	animation: vue-dropdown-content-bottom 200ms ease-out;

	&.enterFrom {
		transition: 200ms ease-out;
		opacity: 0;
		transform: translateY(16px);
	}

	&.enterActive {
		opacity: 1;
		transform: translateY(0);
	}

	&.leaveActive {
		transition: 200ms ease-in;
		opacity: 1;
		transform: translateY(0);
	}

	&.leaveTo {
		opacity: 0;
		transform: translateY(16px);
	}
}

</style>