import { styled } from '@linaria/react';
import { useStore } from 'jotai';
import { enUS } from 'date-fns/locale';
import { APP_LOCALES } from 'twenty-shared/translations';
import { isDefined } from 'twenty-shared/utils';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { dateLocaleState } from '~/localization/states/dateLocaleState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useUpdateWorkspaceMemberSettings } from '@/settings/profile/hooks/useUpdateWorkspaceMemberSettings';
import { useInvalidateMetadataStore } from '@/metadata-store/hooks/useInvalidateMetadataStore';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { getDateFnsLocale } from '@/ui/field/display/utils/getDateFnsLocale';
import { dynamicActivate } from '~/utils/i18n/dynamicActivate';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const LOCALE_EN    = APP_LOCALES['en']     as keyof typeof APP_LOCALES;
const LOCALE_ZH_CN = APP_LOCALES['zh-CN'] as keyof typeof APP_LOCALES;

// ── Styles ────────────────────────────────────────────────────────────────

const StyledWrapper = styled.div<{ $collapsed: boolean }>`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  padding: ${themeCssVariables.spacing[1]};
  padding-left: ${({ $collapsed }) =>
    $collapsed ? themeCssVariables.spacing[1] : themeCssVariables.spacing[2]};
  width: 100%;
`;

const StyledPillRow = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  gap: 1px;
  height: ${themeCssVariables.spacing[5]};
  overflow: hidden;
  padding: 1px;
`;

const StyledPill = styled.button<{ $active: boolean }>`
  align-items: center;
  background: ${({ $active }) =>
    $active
      ? themeCssVariables.background.primary
      : 'transparent'};
  border: none;
  border-radius: calc(${themeCssVariables.border.radius.sm} - 1px);
  color: ${({ $active }) =>
    $active
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.tertiary};
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  height: 100%;
  justify-content: center;
  line-height: 1;
  min-width: 28px;
  padding: 0 ${themeCssVariables.spacing[1]};
  transition: background 120ms, color 120ms;

  &:hover {
    color: ${({ $active }) =>
      $active
        ? themeCssVariables.font.color.primary
        : themeCssVariables.font.color.secondary};
  }
`;

const StyledIconPill = styled.button`
  align-items: center;
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  height: ${themeCssVariables.spacing[7]};
  justify-content: center;
  padding: 0 ${themeCssVariables.spacing[1]};
  transition: background 120ms, color 120ms;
  width: calc(100% - ${themeCssVariables.spacing[2]});

  &:hover {
    background: ${themeCssVariables.background.transparent.light};
    color: ${themeCssVariables.font.color.primary};
  }
`;

// ── Component ─────────────────────────────────────────────────────────────

export const NavigationDrawerLocaleToggle = () => {
  const store = useStore();
  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useAtomState(
    currentWorkspaceMemberState,
  );
  const isNavigationDrawerExpanded = useAtomStateValue(
    isNavigationDrawerExpandedState,
  );
  const { updateWorkspaceMemberSettings } = useUpdateWorkspaceMemberSettings();
  const { invalidateMetadataStore } = useInvalidateMetadataStore();

  if (!isDefined(currentWorkspaceMember)) return null;

  const currentLocale = (currentWorkspaceMember.locale ?? LOCALE_EN) as keyof typeof APP_LOCALES;
  const isZh = currentLocale === LOCALE_ZH_CN;

  const applyLocale = async (locale: keyof typeof APP_LOCALES) => {
    if (locale === currentLocale) return;

    // 1. 乐观更新本地状态
    setCurrentWorkspaceMember({ ...currentWorkspaceMember, locale });

    // 2. 激活新语言包（即时生效，零刷新）
    await dynamicActivate(locale);

    // 3. 更新 date-fns locale
    const dateFnsLocale = await getDateFnsLocale(locale);
    store.set(dateLocaleState.atom, {
      locale,
      localeCatalog: dateFnsLocale ?? enUS,
    });

    // 4. 持久化到 localStorage
    try { localStorage.setItem('locale', locale); } catch {}

    // 5. 同步到服务端
    await updateWorkspaceMemberSettings({
      workspaceMemberId: currentWorkspaceMember.id,
      update: { locale },
    });

    // 6. 刷新元数据（对象名称等跟随语言切换）
    invalidateMetadataStore();
  };

  // ── 收起状态：显示当前语言缩写，点击切换 ─────────────────────────────────
  if (!isNavigationDrawerExpanded) {
    return (
      <StyledWrapper $collapsed>
        <StyledIconPill
          title={isZh ? 'Switch to English' : '切换为中文'}
          onClick={() => applyLocale(isZh ? LOCALE_EN : LOCALE_ZH_CN)}
        >
          {isZh ? 'EN' : '中'}
        </StyledIconPill>
      </StyledWrapper>
    );
  }

  // ── 展开状态：EN | 中 双 pill，高亮当前 ──────────────────────────────────
  return (
    <StyledWrapper $collapsed={false}>
      <StyledPillRow>
        <StyledPill
          $active={!isZh}
          onClick={() => applyLocale(LOCALE_EN)}
          title="English"
        >
          EN
        </StyledPill>
        <StyledPill
          $active={isZh}
          onClick={() => applyLocale(LOCALE_ZH_CN)}
          title="简体中文"
        >
          中
        </StyledPill>
      </StyledPillRow>
    </StyledWrapper>
  );
};
